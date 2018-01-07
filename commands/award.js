const Social = require('../base/Social.js');

class Award extends Social {
  constructor(client) {
    super(client, {
      name: 'award',
      description: 'Gives a nominated user points.',
      usage: 'award <@mention|userid> <amount>',
      category: 'Moderation',
      extended: 'This will give points to a nominated user.',
      cost: 0,
      hidden: true,
      aliases: ['reward', 'give'],
      botPerms: [],
      permLevel: 'Police'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (args.length === 0) return message.response(undefined, 'You need to mention someone to reward them.');
    try {
      const [bot, user] = await this.verifySocialUser(message, args[0]);
      if (bot) return message.response('❗', 'Bot\'s cannot accumulate energy.');
      if (isNaN(args[1])) return message.response(undefined, 'Not a valid amount');
      if (args[1] < 0) return message.response(undefined, 'You cannot award less than zero.');
      await this.cmdRew(message, user, parseInt(args[1]));
    } catch (error) {
      console.log(error.stack);
    }
  }
}

module.exports = Award;