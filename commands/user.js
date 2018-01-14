const Command = require('../base/Command.js');
const { MessageEmbed } = require('discord.js');

class User extends Command {
  constructor(client) {
    super(client, {
      name: 'user',
      description: 'Display info on a user.',
      category: 'Moderation',
      usage: 'user <id>',
      botPerms: ['EMBED_LINKS', 'SEND_MESSAGES'],
      permLevel: 'Trainee'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const firstMention = message.mentions.users.first();
    const target = (firstMention) ? firstMention : message.author;
    const connection = await this.client.db.acquire();
    let userData, inventory, blobData;
    try {
      userData = await this.client.db.getUserData(connection, message.guild.id, target.id);
      inventory = await this.client.db.getUserInventory(connection, message.guild.id, target.id);
      blobData = await this.client.db.getUserBlobs(connection, message.guild.id, target.id);
    } finally {
      connection.release();
    }
    let invFormatting = inventory.filter(x => x.amount > 0).map(x => `${x.amount}x ${x.name}`).join(', ');
    const blobsOwned = blobData.filter(x => x.caught);
    const blobCount = blobsOwned.filter(x => x.amount > 0).length;
    const blobsSeen = blobData.length;
    if (invFormatting === '') invFormatting = 'Empty';
    const embed = new MessageEmbed()
      .setAuthor(target.username, target.displayAvatarURL())
      .setTimestamp()
      .addField('Member Energy', `${userData.energy}`, true)
      .addField('Inventory', `${invFormatting}`, true)
      .addField('Blobs On Hand', `${blobCount} (${blobsOwned.length} ever owned, ${blobsSeen} seen)`, true)
      .addField('Coins', `${userData.currency}`, true)
      .setFooter('PokéBlobs');
    message.channel.send({ embed });
  }
}

module.exports = User;