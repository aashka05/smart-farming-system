const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sfs_db",
  password: "postgres",
  port: 5433,
});

module.exports = pool;