
const Discord = require('discord.js');

const Context = require('./Context.js');
const Director = require('./database/Director.js');


class Client extends Discord.Client {
  constructor(options) {
    super(options);

    this.db = new Director(options.db);
    this.commands = new Discord.Collection();
    this.prefixes = options.prefixes ? options.prefixes : ['-'];
  }

  get commandRegex() {
    // escape the prefixes so they're 'regex-safe'
    const escapedPrefixes = this.prefixes.map(x => x.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
    // return the regex that captures commands
    return new RegExp(`^(${escapedPrefixes})([a-zA-Z](?:[a-zA-Z0-9]+)?) *(?: (.+))?$`);
  }

  async processCommands(message) {
    const match = this.commandRegex.exec(message.content);
    if (!match)
      return;

    const command = this.commands.get(match[2]);
    if (!command)
      return;
    
    const context = await (new Context(this, message, match[1], match[3])).prepare();

    try {
      if (await command.check(context))
        await command.run(context);
    } finally {
      await context.destroy();
    }
  }

  async loadCommandObject(commandObject) {
    const command = new commandObject(this);

    if (!command.meta || !command.meta.name)
      throw new Error('command object has broken meta');

    if (this.commands.has(command.meta.name))
      throw new Error('command of name already registered');
    
    this.commands.set(command.meta.name, command);
  }

  async destroy() {
    await super.destroy();
    await this.db.release();
  }
}

module.exports = Client;
