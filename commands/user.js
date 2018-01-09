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
    const energy = await this.client.energy.get(`${message.guild.id}-${target}`);
    const inventory = await this.client.inventory.get(`${message.guild.id}-${target}`);
    const embed = new MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setTimestamp()
      .addField('Member Energy', `${energy.points}`, true)
      .addField('Inventory', `${inventory}`, true)
      .addField('Total Blobs Caught', '<insert info here>', true)
      .setFooter('PokéBlobs');
    message.channel.send({ embed });
  }
}

module.exports = User;