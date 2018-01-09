const { Structures } = require('discord.js');

module.exports = Structures.extend('GuildMember', DiscordGuildMember => {
  return class GuildMember extends DiscordGuildMember {

    constructor(...args) {
      super(...args);
      this.fullId = `${this.guild.id}-${this.id}`;
    }

    get inventory() {
      if (!this.client.inventory.get(this.fullId)) return false;
      return this.client.inventory.get(this.fullId);
    }

    get energy() {
      if (!this.client.energy.get(this.fullId)) return { energy: 20, level: 0, user: this.id, guild: this.guild.id, daily: 1504120109 };
      return this.client.energy.get(this.fullId);
    }

    giveEnergy(points) {
      const energy = this.energy;
      energy.points += points;
      return this.client.energy.set(this.fullId, energy);
    }

    takeEnergy(points) {
      const energy = this.energy;
      energy.points -= points;
      return this.client.energy.set(this.fullId, energy);
    }

    setLevel(level) {
      const score = this.score;
      score.level = level;
      return this.client.energy.set(this.fullId, score);
    }

  };
});
