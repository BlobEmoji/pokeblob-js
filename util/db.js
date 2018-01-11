const { Pool } = require('pg');

const errorEnum = {
  FOREIGN_KEY_VIOLATION: '23503',
  UNIQUE_VIOLATION: '23505',
  CHECK_VIOLATION: '23514'
};

class DatabaseBackend {
  constructor(credentials) {
    this.pool = new Pool(credentials);
  }

  async acquire() {
    return await this.pool.connect();
  }

  async ensureGuild(client, guildID) {
    await client.query(`
      INSERT INTO guilds (id)
      VALUES ($1::BIGINT)
      ON CONFLICT (id) DO NOTHING
      `, [guildID]);
  }

  async ensureMember(client, guildID, memberID) {
    await this.ensureGuild(client, guildID);
    const res = await client.query(`
      INSERT INTO users (id, guild)
      VALUES (
        $1::BIGINT,
        $2::BIGINT
      ) ON CONFLICT (id, guild) DO UPDATE
      SET energy = CASE
        WHEN users.energy < 30 AND users.last_used_energy < day_timestamp() THEN 30
        ELSE users.energy
        END,
      last_used_energy = day_timestamp()
      RETURNING id, unique_id, guild, energy, last_used_energy
    `, [memberID, guildID])
    return res.rows[0];
  }

  async modifyMemberEnergy(client, guildID, memberID, amount) {
    await this.ensureMember(client, guildID, memberID);
    const res = await client.query(`
      UPDATE users
      SET energy = users.energy + $1
      WHERE id = $2::BIGINT AND guild = $3::BIGINT
      RETURNING id, guild, energy, last_used_energy
    `, [amount, memberID, guildID]);
    return res.rows[0];
  }

  async updateMemberEnergy(client, guildID, memberID, amount) {
    await this.ensureMember(client, guildID, memberID);
    const res = await client.query(`
      UPDATE users
      SET energy = $1
      WHERE id = $2::BIGINT AND guild = $3::BIGINT
      RETURNING id, guild, energy, last_used_energy
    `, [amount, memberID, guildID]);
    return res.rows[0];
  }

  async giveUserItem(client, guildID, memberID, itemID, amount) {
    const member = await this.ensureMember(client, guildID, memberID);
    const res = await client.query(`
      INSERT INTO items (item_id, user_id, amount)
      VALUES ($1::BIGINT, $2::BIGINT, $3)
      ON CONFLICT (item_id, user_id)
      DO UPDATE SET
      amount = items.amount + $3
      RETURNING unique_id, item_id, user_id, amount
    `, [itemID, member.unique_id, amount]);
    return res.rows[0];
  }

  async removeUserItem(client, guildID, memberID, itemID, amount) {
    const member = await this.ensureMember(client, guildID, memberID);
    const res = await client.query(`
      UPDATE items SET
      amount = items.amount - $3
      WHERE item_id = $1::BIGINT AND user_id = $2::BIGINT AND amount > $3
      RETURNING unique_id, item_id, user_id, amount
    `, [itemID, member.unique_id, amount]);

    // if this returns undefined the user doesn't have the required amount of said item
    return res.rows[0];
  }

  async getUserData(client, guildID, memberID) {
    const member = await this.ensureMember(client, guildID, memberID);
    const res = await client.query(`
      SELECT * FROM users WHERE unique_id = $1::BIGINT
    `, [member.unique_id]);
    return res.rows[0];
  }

  async getUserInventory(client, guildID, memberID) {
    const member = await this.ensureMember(client, guildID, memberID);
    const res = await client.query(`
      SELECT items.unique_id, items.item_id, items.amount,
      itemdefs.name, itemdefs.value, itemdefs.potential, itemdefs.mode
      FROM items
      INNER JOIN itemdefs ON items.item_id = itemdefs.id
      WHERE user_id = $1::BIGINT
    `, [member.unique_id]);
    return res.rows;
  }

  async getUserBlobs(client, guildID, memberID) {
    const member = await this.ensureMember(client, guildID, memberID);
    const res = await client.query(`
      SELECT blobs.unique_id, blobs.blob_id, blobs.caught, blobs.amount,
      blobdefs.emoji_id, blobdefs.emoji_name
      FROM blobs
      INNER JOIN blobdefs ON blobs.blob_id = blobdefs.unique_id
      WHERE user_id = $1::BIGINT
    `, [member.unique_id]);
    return res.rows;
  }
}

module.exports = DatabaseBackend;
