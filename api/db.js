const sqlite3 = require('sqlite3').verbose();

// SQLite database setup
const db = new sqlite3.Database('./db.sqlite3');

// Create the users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

// Create the music table
db.run(`
  CREATE TABLE IF NOT EXISTS music (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    genre TEXT NOT NULL,
    country TEXT NOT NULL,
    filename TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`);

// Create the preferences table
db.run(`
  CREATE TABLE IF NOT EXISTS preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT,
    artist TEXT,
    genre TEXT,
    country TEXT,
    dataThreshold INTEGER,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`);

module.exports = db;