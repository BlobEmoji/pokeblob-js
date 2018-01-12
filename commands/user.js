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
    const target = (message.mentions.members.length > 0) ? message.mentions.members[0] : message.author;
    const connection = await this.client.db.acquire();
    let userData, inventory, blobData;
    try {
      userData = await this.client.db.getUserData(connection, message.guild.id, target.id);
      inventory = await this.client.db.getUserInventory(connection, message.guild.id, target.id);
      blobData = await this.client.db.getUserBlobs(connection, message.guild.id, target.id);
    } finally {
      connection.release();
    }
    let invFormatting = inventory.map(x => `${x.amount}x ${x.name}`).join();
    let blobCount = blobData.filter(x => x.caught && x.amount > 0).length;
    let blobsSeen = blobData.length;
    if (invFormatting === '') invFormatting = 'Empty';
    const embed = new MessageEmbed()
      .setAuthor(target.username, target.displayAvatarURL())
      .setTimestamp()
      .addField('Member Energy', `${userData.energy}`, true)
      .addField('Inventory', `${invFormatting}`, true)
      .addField('Total Blobs Caught', `${blobCount} (${blobsSeen} seen)`, true)
      .setFooter('PokéBlobs');
    message.channel.send({ embed });
  }
}

module.exports = User;