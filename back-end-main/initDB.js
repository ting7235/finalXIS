const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db'); // 使用文件数据库

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS dogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      breed TEXT NOT NULL,
      age INTEGER NOT NULL,
      description TEXT NOT NULL,
      image TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      dogId INTEGER NOT NULL,
      message TEXT NOT NULL,
      response TEXT,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(dogId) REFERENCES dogs(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      dogId INTEGER NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(dogId) REFERENCES dogs(id),
      UNIQUE(userId, dogId)
    )
  `);


  // const stmt = db.prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");
  // stmt.run("23@qq.com", "123", "user");
  // stmt.finalize();
});

module.exports = db;
