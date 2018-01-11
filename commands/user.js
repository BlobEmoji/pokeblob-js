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
    const target = args[0];
    const connection = await this.client.db.acquire();
    try {
      const userData = await this.client.db.getUserData(connection, message.guild.id, target);
      const inventory = await this.client.db.getUserInventory(connection, message.guild.id, target);
    } finally {
      connection.release();
    }
    const invFormatting = inventory.map(x => `${x.amount}x ${x.name}`).join();
    const embed = new MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setTimestamp()
      .addField('Member Energy', `${userData.energy}`, true)
      .addField('Inventory', `${invFormatting}`, true)
      .addField('Total Blobs Caught', '<insert info here>', true)
      .setFooter('PokéBlobs');
    message.channel.send({ embed });
  }
}

module.exports = User;