const Social = require('../base/Command.js');

class Store extends Social {
  constructor(client) {
    super(client, {
      name: 'store',
      description: 'Display All Store Items',
      usage: 'store <-buy|-sell|-view>',
      category: 'Economy',
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.settings.get(message.guild.id);
    if (!message.flags.length) {
      return message.reply(`|\`❌\`| ${this.help.usage}`);
    }

    switch (message.flags[0]) {
      case ('buy'): {
        const name = args.join(' ');
        
        const connection = await this.client.db.acquire();
        let storeItem;
        try {
          storeItem = await this.client.db.getStoreItemByName(connection, name);

          if (!storeItem) return message.channel.send('I\'m not sure what that item is, did you spell it correctly?');

          const response = await this.client.awaitReply(message, `Are you sure you want to purchase ${storeItem.name} for 💰 ${storeItem.value}?`, undefined, null);
          if (['y', 'yes'].includes(response.toLowerCase())) {
          
            await connection.query('BEGIN');
            let deducted = await this.client.db.takeUserCurrency(connection, message.guild.id, message.author.id, storeItem.value);
            if (!deducted) {
              await connection.query('ROLLBACK');
              return message.channel.send('You don\'t appear to have the funds for that.');
            }
            await this.client.db.giveUserItem(connection, message.guild.id, message.author.id, storeItem.id, 1);
            await connection.query('COMMIT');
            return message.channel.send('You have bought the item :tada:');
          } else
          
          if (['n', 'no', 'cancel'].includes(response.toLowerCase())) {
            return message.channel.send('Transaction cancelled.');
          }
        } finally {
          connection.release();
        }
        break;
      }

      case ('sell'): {
        const name = args.join(' ');

        const connection = await this.client.db.acquire();
        let storeItem;
        try {
          storeItem = await this.client.db.getStoreItemByName(connection, name);

          const returnPrice = Math.floor(storeItem.value/2);

          if (!storeItem) return message.channel.send('I\'m not sure what that item is, did you spell it correctly?');

          const response = await this.client.awaitReply(message, `Are you sure you want to sell ${storeItem.name} for 💰 ${returnPrice}?`, undefined, null);
          if (['y', 'yes'].includes(response.toLowerCase())) {
          
            await connection.query('BEGIN');
            let deducted = await this.client.db.removeUserItem(connection, message.guild.id, message.author.id, storeItem.id, 1);
            if (!deducted) {
              await connection.query('ROLLBACK');
              return message.channel.send('You don\'t appear to actually have that item.');
            }
            await this.client.db.giveUserCurrency(connection, message.guild.id, message.author.id, returnPrice);
            await connection.query('COMMIT');
            return message.channel.send('You have sold the item :tada: ');
          } else
          
          if (['n', 'no', 'cancel'].includes(response.toLowerCase())) {
            return message.channel.send('Transaction cancelled.');
          }
        } finally {
          connection.release();
        }
        break;
      }

      case ('view'): {
        const connection = await this.client.db.acquire();
        let storeItems;
        try {
          storeItems = await this.client.db.getStoreItems(connection);
        } finally {
          connection.release();
        }
        if (storeItems.length === 0) return message.channel.send('Nothing is for sale');
        message.channel.send(storeItems.map(item => 
          `${item.name}: ${item.value} 💰`).join('\n'), { code: true}
        );
      }
    }
  }
}
module.exports = Store;
