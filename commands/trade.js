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
      const yourBlobData = await this.client.db.getBlobByName(connection, yourBlob);
      const usersBlobData = await this.client.db.getBlobByName(connection, usersBlob);
      message.channel.send(`Trading your <:${yourBlob}:${yourBlobData.emoji_id}> for ${message.mentions.users.first().tag}'s <:${usersBlob}:${usersBlobData.emoji_id}>.\nType\`.confirm\` to send a trade request\nType \`.cancel\` to cancel trade.`);
      const filter = m => (m.author.id == message.author.id && [`${settings.prefix}confirm`, `${settings.prefix}cancel`].includes(m.content));
      let response;
      try {
        response = (await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })).first().content;
      } catch (e) {
        return;
      }
      if (response == `${settings.prefix}confirm`) {
        message.channel.send(`${message.mentions.users.first()} Please confirm trade with ${message.author.tag}. Trading your <:${usersBlob}:${usersBlobData.emoji_id}> for ${message.author.tag}'s <:${yourBlob}:${yourBlobData.emoji_id}>`);
        const filter = m => (m.author.id == message.mentions.users.first().id && [`${settings.prefix}confirm`, `${settings.prefix}cancel`].includes(m.content));
        let response;
        try {
          response = (await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })).first().content;
        } catch (e) {
          return;
        }
        if (response == `${settings.prefix}confirm`) {
          message.channel.send(`Trade between ${message.author.tag} and ${message.mentions.users.first().tag} confirmed.`);
          await this.client.db.takeUserBlob(connection, message.guild.id, message.author.id, yourBlobData.emoji_id, 1);
          await this.client.db.giveUserBlob(connection, message.guild.id, message.author.id, usersBlobData.emoji_id, 1);
          await this.client.db.takeUserBlob(connection, message.guild.id, message.mentions.users.first().id, usersBlobData.emoji_id, 1);
          await this.client.db.giveUserBlob(connection, message.guild.id, message.author.id, yourBlobData.emoji_id, 1);
        } else if (response == `${settings.prefix}cancel`) {
          message.channel.send(`Trade between ${message.author.tag} and ${message.mentions.users.first().tag} confirmed.`);
        }
      }
      
    } finally {
      connection.release();
    }
  }
}

module.exports = Trade;