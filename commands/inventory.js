const Command = require('../base/Command.js');

class Inventory extends Command {
  constructor(client) {
    super(client, {
      name: 'inventory',
      description: 'Display the items in your inventory.',
      usage: 'inventory',
      aliases: ['inv'],
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const inventory = message.member.inventory;
      console.log(inventory);
      if (!inventory) return message.response(undefined, 'This feature isn\'t finished, please come back later...');
      // message.channel.send(inventory.map(item => item));
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Inventory;