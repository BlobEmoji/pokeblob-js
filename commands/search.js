const Command = require('../base/Command.js');
const blobs = require('../data/blobs/blobs.json');

class Search extends Command {
  constructor(client) {
    super(client, {
      name: 'search',
      description: 'Search the tall grass for an item.',
      usage: 'search',
      guildOnly: true,
      extended: 'Search the tall grass in hopes of finding something. Consumes one energy.',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const connection = await this.client.db.acquire();
    try {
      const { energy } = await this.client.db.getUserData(connection, message.guild.id, message.author.id);

      if (energy <= 0) {
        await message.channel.send('Not enough energy...');
        return;
      }

      await this.client.db.modifyMemberEnergy(connection, message.guild.id, message.author.id, -1)
      const msg = await message.channel.send(`_${message.author} searches through the tall grass and finds..._`);
      await this.client.wait(2500);    

      const blobChance = 1/3;
      const moneyChance = 1/3;            

      let roll = Math.random();    
      if (roll < blobChance) {
        //To-do add catch
        let blobTier = '';
        let tierSize = 0;
        let blobName = '';
        
        roll = Math.random();
        if (roll < commonChance) {
          blobTier = 'common';
          tierSize = Object.keys(blobs.common).length;
          blobName = Object.keys(blobs.common)[Math.floor(Math.random() * tierSize)].valueOf();
          
        }
        else if (roll >= commonChance && roll < commonChance + uncommonChance) {
          blobTier = 'uncommon';
          tierSize = Object.keys(blobs.uncommon).length;
          blobName = Object.keys(blobs.uncommon)[Math.floor(Math.random() * tierSize)].valueOf();
          
        }
        else if (roll >= commonChance + uncommonChance && roll < commonChance + uncommonChance + rareChance) {
          blobTier = 'rare';
          tierSize = Object.keys(blobs.rare).length;
          blobName = Object.keys(blobs.rare)[Math.floor(Math.random() * tierSize)].valueOf();
          
        }
        else {
          blobTier = 'legendary';
          tierSize = Object.keys(blobs.legendary).length;
          blobName = Object.keys(blobs.legendary)[Math.floor(Math.random() * tierSize)].valueOf();
          
        }
        const blob = this.client.emojis.find('name', blobName);
        msg.edit(`_${message.author} searches through the tall grass and finds..._ ${blobTier} ${blob}**!** You have ${energy.points} energy remaining.\nType \`${this.client.config.prefix}catch\` to try and capture it!\n\`${this.client.config.prefix}search\` to let this blob run away and continue looking (1 energy)\n\`${this.client.config.prefix}cancel\` to let the blob run away and stop searching`); // eslint-disable-line no-undef
      }
      else if (roll >= blobChance && roll < blobChance + moneyChance) {
        const money = Math.ceil(Math.random()*10);
        await this.client.db.giveUserCurrency(connection, message.guild.id, message.author.id, money);
        msg.edit(`_${message.author} searches through the tall grass and finds..._ ${money} 💰**!** You have ${energy.points} energy remaining.\n\`${this.client.config.prefix}search\` continue looking (1 energy)\n\`${this.client.config.prefix}cancel\` to let the blob run away and stop searching`); // eslint-disable-line no-undef
      }
      else {
        msg.edit(`_${message.author} searches through the tall grass and finds..._ nothing**!** You have ${energy.points} energy remaining.\n\`${this.client.config.prefix}search\` to continue looking (1 energy)\n\`${this.client.config.prefix}cancel\` to let the blob run away and stop searching`); // eslint-disable-line no-undef
      }
    } finally {
      connection.release();
    }
  }
}

module.exports = Search;