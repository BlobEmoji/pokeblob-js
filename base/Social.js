const Command = require('./Command.js');
class Social extends Command {

  constructor(client, options) {
    super(client, Object.assign(options, {
      guildOnly: true
    }));


  } 

  async verifySocialUser(message, user) {
    try {
      const check = await this.verifyUser(message, user);
      return [check.bot ? true : false, check];
    } catch (error) {
      console.log(error);
      // console.log.error(error);
    }
  }

  emoji(guild) {
    const settings = this.client.getSettings(guild);
    if (settings.customEmoji === 'true') return this.client.emojis.get(settings.gEmojiID);
    return settings.uEmoji;
  }

  ding(guild, score) {
    const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
    if (score.level < curLevel) {
      return curLevel;
    } else

    if (score.level > curLevel) {
      return curLevel;
    }
    return score.level;
  }

  async cmdPay(message, user, cost, perms) {
    const amount = parseInt(cost) * parseInt(perms.length) * Math.floor(parseInt(message.settings.costMulti));
    try {
      const [bot, _user] = await this.verifySocialUser(message, user); // eslint-disable-line no-unused-vars
      const getPayee = message.guild.member(_user.id);
      const score = getPayee.score;
      if (amount > score.points) {
        message.response(undefined, `Insufficient funds, you need ${amount}${this.emoji(message.guild.id)}. Your current balance: ${score.points}${this.emoji(message.guild.id)}`);
        return false;
      }
      getPayee.takePoints(amount);
      this.client.points.set(getPayee.fullId, score);
      return true;
    } catch (error) {
      console.log.error(error);
    }
  }

  async cmdRew(message, user, amount) {
    try {
      const getPayee = message.guild.member(user);
      getPayee.givePoints(parseInt(amount));
      await message.channel.send(`Awarded ${this.emoji(message.guild.id)}${parseInt(amount)} points to ${message.guild.member(user).displayName}.`);
      return;
    } catch (error) {
      console.log.error(error);
    }
  }

  async cmdPun(message, user, amount) {
    try {
      const getPayee = message.guild.member(user);
      getPayee.takePoints(parseInt(amount));
      await message.channel.send(`Deducted ${this.emoji(message.guild.id)}${parseInt(amount)} points from ${message.guild.member(user).displayName}.`);
      return;
    } catch (error) {
      console.log.error(error);
    }
  }

}

module.exports = Social;