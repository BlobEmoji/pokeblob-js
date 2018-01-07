const Social = require('../base/Social.js');

class Score extends Social {
  constructor(client) {
    super(client, {
      name: 'score',
      description: 'Displays your current points.',
      usage: 'score',
      category: 'Economy',
      aliases: ['points', 'bal', 'balance'],
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const energy = await this.client.energy.get(`${message.guild.id}-${message.author.id}`);
    message.channel.send(`You currently have ${energy.points} energy.`);
  }
}

module.exports = Score;