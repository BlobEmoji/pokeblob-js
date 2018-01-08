module.exports = class {
  constructor(client) {
    this.client = client;
  }
  async run(member) {
    const guild = member.guild;
    this.client.energy.delete(`${guild.id}-${member.id}`);     
  } catch(error) {
    console.log(error);
  }

};