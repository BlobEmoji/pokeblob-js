const Command = require('../base/Command.js');

class Trade extends Command {
  constructor(client) {
    super(client, {
      name: 'trade',
      description: 'Trade blobs with a user.',
      category: 'Pokèblob',
      usage: 'trade <your blob> <users blob>',
      guildOnly: true,
      extended: 'Trade one of your blobs for one of another users blobs. This requires the other user to accept the trade.',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, [yourBlob, usersBlob], level) { // eslint-disable-line no-unused-vars
    const connection = await this.client.db.acquire();
    try {
      const yourBlobID = await this.client.db.getBlobID(connection, yourBlob);
      const usersBlobID = await this.client.db.getBlobID(connection, usersBlob);
      message.channel.send(`Trading your <:${yourBlob}:${yourBlobID}> for ${message.mentions.users.first().tag}'s <:${usersBlob}:${usersBlobID}>.\nType\`.confirm\` to send a trade request\nType \`.cancel\` to cancel trade.`);
      await this.client.db.takeUserBlob(connection, message.guild.id, message.author.id, 1);
    } finally {
      connection.release();
    }
  }
}

module.exports = Trade;