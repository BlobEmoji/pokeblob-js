const Command = require('../base/Command.js');

class Inventory extends Command {
  constructor(client) {
    super(client, {
      name: 'inventory',
      description: 'Display the items in your inventory.',
      usage: 'inventory',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const inventory = this.client.inventory.get(`${message.guild.id}-${message.author.id}`); // eslint-disable-line no-unused-vars
  }
}

module.exports = Inventory;