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
    const settings = message.settings; // eslint-disable-line no-unused-vars
    const connection = await this.client.db.acquire();
    try {
      const inventory = this.client.db.getUserInventory(connection, message.guild.id, message.author.id); // eslint-disable-line no-unused-vars
      console.log(inventory);
    } finally {
      connection.release();
    }
  }
}

module.exports = Use;