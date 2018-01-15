const Command = require('../base/Command.js');

class Use extends Command {
  constructor(client) {
    super(client, {
      name: 'use',
      description: 'Uses an item from your inventory.',
      category: 'Pokèblob',
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
      const logged = await this.client.db.getStoreItemByName(connection, consumable);
      console.log(logged);
      await this.client.removeUserItem(connection, message.guild.id, message.author.id, logged.id, 1);
      message.channel.send(`${message.author} used a ${logged.name}.`);
    } finally {
      connection.release();
    }
  }
}

module.exports = Use;