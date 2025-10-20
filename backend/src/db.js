const { Pool } = require("pg");

const pool = new Pool({
  host: "todo-db",       // nombre del servicio de PostgreSQL en docker-compose
  user: "postgres",      // usuario por defecto
  password: "postgres",  // contraseña por defecto
  database: "postgres",  // base de datos por defecto
  port: 5432
});

module.exports = pool;

