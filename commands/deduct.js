const Social = require(`${process.cwd()}/base/Social.js`);

class Deduct extends Social {
  constructor(client) {
    super(client, {
      name: 'deduct',
      description: 'Takes points away from the nominated user.',
      usage: 'deduct <@mention|userid> <amount>',
      category:'Moderation',
      extended: 'This will take points away from a nominated user.',
      cost: 5,
      hidden: true,
      aliases: ['punish', 'take'],
      botPerms: [],
      permLevel: 'Police'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (args.length === 0) return message.response(undefined, 'You need to mention someone to punish them.');
    try {
      const [bot, user] = await this.verifySocialUser(message, args[0]);
      if (bot) return message.response('❗', 'Bot\'s cannot accumulate energy.');
      if (isNaN(args[1])) return message.response(undefined, 'Not a valid amount');
      if (args[1] < 0) return message.response(undefined, 'You cannot deduct less than zero energy.');
      else if (args[1] < 1) return message.response(undefined, 'That user has no energy.');
      await this.cmdPun(message, user, parseInt(args[1]));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Deduct;