const Command = require('../base/Command.js');

class Search extends Command {
  constructor(client) {
    super(client, {
      name: 'search',
      description: 'Search the tall grass for an item.',
      category: '',
      usage: 'search',
      guildOnly: true,
      extended: 'Search the tall grass in hopes of finding something. Consumes one energy.',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const energy = this.client.energy.get(message.author.id);
    const msg = await message.channel.send(`_${message.author} searches through the tall grass and finds..._`);
    await this.client.wait(2500);
    msg.edit(`_${message.author} searches through the tall grass and finds..._ item**!** You have ${energy} energy remaining.\nType \`.catch\` to try and capture it!\n\`.search\` to let this blob run away and continue looking (1 energy)\n\`.cancel\` to let the blob run away and stop searching`); // eslint-disable-line no-undef
  }
}

module.exports = Search;