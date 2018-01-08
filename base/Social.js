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
    const settings = this.client.getSettings(guild.id);
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
        message.response(undefined, `Insufficient funds, you need ${amount}<:blobcoin:398579309276823562>. Your current balance: ${score.points}<:blobcoin:398579309276823562>`);
        return false;
      }
      getPayee.takeEnergy(amount);
      this.client.energy.set(getPayee.fullId, score);
      return true;
    } catch (error) {
      console.log.error(error);
    }
  }

  async cmdRew(message, user, amount) {
    try {
      const getPayee = message.guild.member(user);
      getPayee.giveEnergy(parseInt(amount));
      await message.channel.send(`Awarded <:blobcoin:398579309276823562>${parseInt(amount)} to ${message.guild.member(user).displayName}.`);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async cmdPun(message, user, amount) {
    try {
      const getPayee = message.guild.member(user);
      getPayee.takeEnergy(parseInt(amount));
      await message.channel.send(`Deducted <:blobcoin:398579309276823562>${parseInt(amount)} from ${message.guild.member(user).displayName}.`);
      return;
    } catch (error) {
      console.log.error(error);
    }
  }

}

module.exports = Social;