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
    const settings = this.client.settings.get(guild.id);
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

  async usrBal(message, user) {
    const id = await this.verifySocialUser(user);
    const score = this.client.points.get(`${message.guild.id}-${id}`) || this.client.points.set(`${message.guild.id}-${id}`, {
      points: 0,
      level: 0,
      user: id,
      guild: message.guild.id,
      daily: 1504120109
    }).get(`${message.guild.id}-${id}`);
    const level = this.ding(message.guild.id, score);
    score.level = level;
    this.client.points.set(`${message.guild.id}-${id}`, score);
    const YouThey = id === message.author.id ? 'You' : 'They';
    const YouThem = YouThey.length > 3 ? 'them' : 'you';
    return score ? `${YouThey} currently have ${score.points} ${this.emoji(message.guild.id)}'s, which makes ${YouThem} level ${score.level}!` : `${YouThey} have no ${this.emoji(message.guild.id)}'s, or levels yet.`;
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
      getPayee.giveEnergy(parseInt(amount));
      await message.channel.send(`Awarded ${this.emoji(message.guild.id)}${parseInt(amount)} points to ${message.guild.member(user).displayName}.`);
      return;
    } catch (error) {
      console.log(error);
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