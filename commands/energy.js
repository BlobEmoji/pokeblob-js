const Social = require('../base/Social.js');

class Energy extends Social {
  constructor(client) {
    super(client, {
      name: 'energy',
      description: 'Displays your current points.',
      usage: 'score',
      category: 'Economy',
      cooldown: 5,
      aliases: ['points', 'bal', 'balance'],
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const connection = await this.client.db.acquire();
    try {
      const data = await this.client.db.getUserData(connection, message.guild.id, message.author.id);
    } finally {
      connection.release();
    }
    message.channel.send(`You currently have ${data.energy} energy.`);
  }
}

module.exports = Energy;