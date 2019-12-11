/**
 * Class containing info about the database connection.
 */

const pgp = require('pg-promise')();
export const db = pgp('postgres://postgres:admin@localhost:5432/postgres');