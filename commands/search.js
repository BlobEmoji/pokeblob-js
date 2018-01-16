const Command = require('../base/Command.js');

class Search extends Command {
  constructor(client) {
    super(client, {
      name: 'search',
      description: 'Search the tall grass for an item.',
      category: 'Pokéblob',
      usage: 'search',
      guildOnly: true,
      extended: 'Search the tall grass in hopes of finding something. Consumes one energy.',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = message.settings;
    const connection = await this.client.db.acquire();
    try {
      const { energy } = await this.client.db.getUserData(connection, message.guild.id, message.author.id);

      if (energy <= 0) {
        await message.channel.send('Not enough energy...');
        return;
      }

      await this.client.db.modifyMemberEnergy(connection, message.guild.id, message.author.id, -1);
      const msg = await message.channel.send(`_${message.author} searches through the tall grass and finds..._`);
      await this.client.wait(2500);    

      const blobChance = 1/3;
      const moneyChance = 1/3;            

      const roll = Math.random();    
      if (roll < blobChance) {
        const blob = await this.client.db.getRandomWeightedBlob(connection);
        await this.client.db.acknowledgeBlob(connection, message.guild.id, message.author.id, blob.unique_id);

        msg.edit(`_${message.author} searches through the tall grass and finds..._ a ${blob.rarity_name} <:${blob.emoji_name}:${blob.emoji_id}> (${blob.emoji_name})**!** You have ${energy-1} energy remaining.\nType \`${settings.prefix}catch\` to try and capture it!\n\`${settings.prefix}search\` to let this blob run away and continue looking (1 energy)\n\`${settings.prefix}cancel\` to let the blob run away and stop searching`); // eslint-disable-line no-undef

        const filter = m => (m.author.id === message.author.id && [`${settings.prefix}catch`, `${settings.prefix}cancel`, `${settings.prefix}search`].includes(m.content));
        let response;
        try {
          response = (await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })).first().content;
        } catch (e) {
          return;
        }
        if (response === `${settings.prefix}catch`) {
          // To-do: check if user has, and consume, ball
          await this.client.db.giveUserBlob(connection, message.guild.id, message.author.id, blob.unique_id, 1);
          return message.channel.send(`You captured the **${blob.rarity_name}** <:${blob.emoji_name}:${blob.emoji_id}>!`);
        }
      }
      else if (roll >= blobChance && roll < blobChance + moneyChance) {
        const money = Math.ceil(Math.random()*10);
        await this.client.db.giveUserCurrency(connection, message.guild.id, message.author.id, money);
        msg.edit(`_${message.author} searches through the tall grass and finds..._ ${money} ??**!** You have ${energy-1} energy remaining.\n\`${settings.prefix}search\` continue looking (1 energy).`); // eslint-disable-line no-undef
      }
      else {
        msg.edit(`_${message.author} searches through the tall grass and finds..._ nothing**!** You have ${energy-1} energy remaining.\n\`${settings.prefix}search\` to continue looking (1 energy).`); // eslint-disable-line no-undef
      }
    } finally {
      connection.release();
    }
  }
}

module.exports = Search;