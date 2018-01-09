const Command = require('../base/Command.js');

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
    const energy = this.client.energy.get(message.author.id);
    const commonChance = .6;
    const uncommonChance = .35;
    const rareChance = .14;
    const legendaryChance = .01; // eslint-disable-line no-unused-vars

    if (energy <= 0) {
      await message.channel.send('Not enough energy...');
      return;
    }
    const msg = await message.channel.send(`_${message.author} searches through the tall grass and finds..._`);
    await this.client.wait(2500);    

    var blobChance = 1/3;
    var moneyChance = 1/3;            

    var roll = Math.random();    
    if (roll < blobChance) {
      //To-do add blob and catch
      var blobTier = '';
      roll = Math.random();
      if (roll<commonChance) {
        blobTier = 'common';
      }
      else if (roll >= commonChance && roll < commonChance + uncommonChance) {
        blobTier = 'uncommon';
      }
      else if (roll >= commonChance + uncommonChance && roll < commonChance + uncommonChance + rareChance) {
        blobTier = 'rare';
      }
      else {
        blobTier = 'legendary';
      }
      msg.edit(`_${message.author} searches through the tall grass and finds..._ ${blobTier} blob**!** You have ${energy} energy remaining.\nType \`.catch\` to try and capture it!\n\`.search\` to let this blob run away and continue looking (1 energy)\n\`.cancel\` to let the blob run away and stop searching`); // eslint-disable-line no-undef
    }
    else if (roll >= blobChance && roll < blobChance + moneyChance) {
      var money = Math.ceil(Math.random()*10);
      //To-do add money
      msg.edit(`_${message.author} searches through the tall grass and finds..._ ${money}<:blobcoin:398579309276823562>**!** You have ${energy} energy remaining.\n\`.search\` continue looking (1 energy)\n\`.cancel\` to let the blob run away and stop searching`); // eslint-disable-line no-undef
    }
    else {
      msg.edit(`_${message.author} searches through the tall grass and finds..._ nothing**!** You have ${energy} energy remaining.\n\`.search\` to continue looking (1 energy)\n\`.cancel\` to let the blob run away and stop searching`); // eslint-disable-line no-undef
    }



    
    
    
  }
}

module.exports = Search;
