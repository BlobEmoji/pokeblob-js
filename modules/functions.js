const moment = require('moment');
require('moment-duration-format');

module.exports = (client) => {


  /*
  COMMAND RATELIMIT

  Credit for the ratelimit method goes to York#2400
  */

  client.ratelimit = async (message, level, key, duration) => {
    if (level > 2) return false;
    
    duration = duration * 1000;
    const ratelimits = client.ratelimits.get(message.author.id) || {}; //get the ENMAP first.
    if (!ratelimits[key]) ratelimits[key] = Date.now() - duration; //see if the command has been run before if not, add the ratelimit
    const differnce = Date.now() - ratelimits[key]; //easier to see the difference
    if (differnce < duration) { //check the if the duration the command was run, is more than the cooldown
      return moment.duration(duration - differnce).format('D [days], H [hours], m [minutes], s [seconds]', 1); //returns a string to send to a channel
    } else {
      ratelimits[key] = Date.now(); //set the key to now, to mark the start of the cooldown
      client.ratelimits.set(message.author.id, ratelimits); //set it
      return true;
    }
  };
  
  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m=>m.author.id = msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };


  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name === 'Promise')
      text = await text;
    if (typeof text !== 'string')
      text = require('util').inspect(text, {depth: 0});

    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(client.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

    return text;
  };


  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */
  
  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code. 
  
  // <String>.toPropercase() returns a proper-cased string such as: 
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };
  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require('util').promisify(setTimeout);

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
    // Always best practice to let the code crash on uncaught exceptions. 
    // Because you should be catching them anyway.
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
  });
};
