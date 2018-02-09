
class Context {
  constructor(client, message, prefix, args) {
    this.client = client;
    this.message = message;
    this.prefix = prefix;
    this.args = args;
    this.connection = null;

    this.targets = [];

    let match, matchMember;
    const re = /([0-9]{17,19})/g;

    if (this.guild)
      while ((match = re.exec(args)) !== null)
        if (matchMember = this.guild.member(match[1]))
          this.targets.push(matchMember);
  }

  async prepare() {
    this.connection = await this.client.db.acquire();

    return this;
  }

  log(...args) {
    return this.client.logger.log(...args);
  }

  get splitArgs() {
    return this.args.trim().split(/ +/g);
  }

  send(...args) {
    return this.message.channel.send(...args);
  }

  edit(...args) {
    return this.message.edit(...args);
  }

  delete(...args) {
    return this.message.delete(...args);
  }

  get channel() {
    return this.message.channel;
  }

  get guild() {
    return this.message.guild;
  }

  get author() {
    return this.message.author;
  }

  get member() {
    return this.message.member;
  }

  get user() {
    return this.message.user;
  }

  get target() {
    return this.targets.length ? this.targets[0] : this.member;
  }

  async destroy() {
    await this.connection.release();
  }
}

module.exports = Context;
