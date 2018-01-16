// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    //  and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Grab the settings for this server from the PersistentCollection
    // If there is no guild, get default conf (DMs)
    const defaults = this.client.config.defaultSettings;
    const settings = message.guild ? this.client.getSettings(message.guild.id) : defaults;

    // For ease of use in commands and functions, we'll attach the settings
    // to the message object, so `message.settings` is accessible.
    message.settings = settings;

    // Get the user or member's permission level from the elevation
    const level = this.client.permlevel(message);
    
    // Also good practice to ignore any message that does not start with our prefix,
    // which is set in the configuration file.
    const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}> `);
    const prefixMention = mentionPrefix.exec(message.content);

    const prefixes = [settings.prefix, defaults.prefix, `${prefixMention}`];
    let prefix = false;

    for (const thisPrefix of prefixes) {
      if (message.content.indexOf(thisPrefix) === 0) prefix = thisPrefix;
    }

    if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>$`))) {
      let mentionMsg = '';
      settings.prefix === defaults.prefix ? mentionMsg = `The prefix is \`${settings.prefix}\`.` : mentionMsg = `This server's prefix is \`${settings.prefix}\`, whilst the default prefix is \`${defaults.prefix}\``;
      return message.channel.send(mentionMsg);
    }

    if (!prefix) return;

    // Here we separate our "command" name, and our "arguments" for the command.
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Check whether the command, or alias, exist in the collections defined
    // in app.js.
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    // using this const varName = thing OR otherthign; is a pretty efficient
    // and clean way to grab one of 2 values!
    if (!cmd) return;


    // Credit for the ratelimit method goes to York#2400
    const rateLimit = await this.client.ratelimit(message, level, cmd.help.name, cmd.conf.cooldown); 
    
    if (typeof rateLimit === 'string') {
      this.client.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) got ratelimited while running command ${cmd.help.name}`, 'Ratelimit');
      return message.channel.send(`Please wait ${rateLimit.toPlural()} to run this command.`); //return stop command from executing
    }

    // Some commands may not be useable in DMs. This check prevents those commands from running
    // and return a friendly error message.
    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send('This command is unavailable via private message. Please run this command in a guild.');

    if (level < this.client.levelCache[cmd.conf.permLevel]) {
      if (settings.systemNotice === 'true') {
        return message.channel.send(`You do not have permission to use this command.
Your permission level is ${level} (${this.client.config.permLevels.find(l => l.level === level).name})
This command requires level ${this.client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
      } else {
        return;
      }
    }
      
    // To simplify message arguments, the author's level is now put on level (not member, so it is supported in DMs)
    // The "level" command module argument will be deprecated in the future.
    message.author.permLevel = level;

    message.flags = [];
    while (args[0] &&args[0][0] === '-') {
      message.flags.push(args.shift().slice(1));
    }
    
    // If the command exists, **AND** the user has permission, run it.
    this.client.log('Log', `${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, 'CMD');
    cmd.run(message, args, level);

    if (message.channel.type === 'text') {      
      const mPerms = this.client.permCheck(message, cmd.conf.botPerms);
      if (mPerms.length) return message.channel.send(`The bot does not have the following permissions \`${mPerms.join(', ')}\``);
    }
  }
};