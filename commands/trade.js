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

  async run(message, [mention, yourBlob, usersBlob], level) { // eslint-disable-line no-unused-vars
    const settings = message.settings;
    const connection = await this.client.db.acquire();
    try {
      const yourBlobID = await this.client.db.getBlobID(connection, yourBlob);
      const usersBlobID = await this.client.db.getBlobID(connection, usersBlob);
      console.log(yourBlobID);
      console.log(usersBlobID);
      message.channel.send(`Trading your <:${yourBlob}:${yourBlobID.emoji_id}> for ${message.mentions.users.first().tag}'s <:${usersBlob}:${usersBlobID.emoji_id}>.\nType\`.confirm\` to send a trade request\nType \`.cancel\` to cancel trade.`);
      const filter = m => (m.author.id == message.author.id && [`${settings.prefix}catch`, `${settings.prefix}cancel`, `${settings.prefix}search`].includes(m.content));
      let response;
      try {
        response = (await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })).first().content;
      } catch (e) {
        return;
      }
      if (response == `${settings.prefix}confirm`) {
        message.channel.send(`${message.mentions.users.first()} Please confirm trade with ${message.author.username}${message.author.discriminator}. Trading your <:${usersBlob}:${usersBlobID}> for ${message.author.username}${message.author.discriminator}'s <:${yourBlob}:${yourBlobID}>`);
      }
      
    } finally {
      connection.release();
    }
  }
}

module.exports = Trade;