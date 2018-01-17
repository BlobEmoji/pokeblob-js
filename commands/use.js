const Command = require('../base/Command.js');

class Use extends Command {
  constructor(client) {
    super(client, {
      name: 'use',
      description: 'Uses an item from your inventory.',
      category: 'Pokéblob',
      usage: 'use <item number>',
      guildOnly: true,
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) { //eslint-disable-line no-unused-vars
    const connection = await this.client.db.acquire();
    try {
      const consumable = args.join(' ');
      const item = await this.client.db.getStoreItemByName(connection, consumable);
      if (!item) {
        return message.channel.send('I don\'t know what this item is.');
      }
      await connection.query('BEGIN');

      const consumed = await this.client.db.removeUserItem(connection, message.guild.id, message.author.id, item.id, 1);
      if (!consumed) {
        await connection.query('ROLLBACK');
        return message.channel.send('You can\'t use something you don\'t have.');
      }

      // apply effects and other check logic here
      await connection.query('COMMIT');
      message.channel.send(`${message.author} used a ${item.name}, ${item.confirm_use_message}`);
    } finally {
      connection.release();
    }
  }
}

module.exports = Use;