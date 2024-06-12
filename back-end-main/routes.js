const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cors = require('cors');

const db = require('./initDB'); 

const SECRET_KEY = 'eis'; 

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const app = express();
app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));


router.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.sendFile(filePath);
  });
});

router.post('/register', upload.none(), (req, res) => {
  const { email, password, role } = req.body;
  const stmt = db.prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");
  stmt.run(email, password, role, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "User registered successfully", userId: this.lastID });
  });
  stmt.finalize();
});

router.post('/login', upload.none(), (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      const token = jwt.sign({ id: row.id, email: row.email, role: row.role }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ message: "Login successful", token, role: row.role,userId:row.id });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  });
});

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};


router.get('/dogs/:id', (req, res) => {
  const dogId = req.params.id;
  db.get("SELECT * FROM dogs WHERE id = ?", [dogId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      if (row.image) {
        row.image = `/uploads/${path.basename(row.image)}`;
      }
      res.status(200).json(row);
    } else {
      res.status(404).json({ message: "Dog not found" });
    }
  });
});

router.post('/dogs', upload.single('image'), (req, res) => {
  const { name, breed, age, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const stmt = db.prepare("INSERT INTO dogs (name, breed, age, description, image) VALUES (?, ?, ?, ?, ?)");
  stmt.run(name, breed, age, description, image, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Dog added successfully", dogId: this.lastID });
  });
  stmt.finalize();
});


router.put('/dogs/:id', upload.single('image'), (req, res) => {
  const dogId = req.params.id;
  const { name, breed, age, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  const stmt = db.prepare("UPDATE dogs SET name = ?, breed = ?, age = ?, description = ?, image = ? WHERE id = ?");
  stmt.run(name, breed, age, description, image, dogId, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Dog updated successfully" });
  });
  stmt.finalize();
});


router.delete('/dogs/:id', (req, res) => {
  const dogId = req.params.id;
  const stmt = db.prepare("DELETE FROM dogs WHERE id = ?");
  stmt.run(dogId, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Dog deleted successfully" });
  });
  stmt.finalize();
});


router.post('/messages', (req, res) => {
  const { userId, dogId, message } = req.body;
  const stmt = db.prepare("INSERT INTO messages (userId, dogId, message, response) VALUES (?, ?, ?, ?)");
  stmt.run(userId, dogId, message, null, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Message sent successfully", messageId: this.lastID });
  });
  stmt.finalize();
});


router.get('/messages', (req, res) => {
  db.all("SELECT * FROM messages", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});


router.get('/messages/:id', (req, res) => {
  const messageId = req.params.id;
  db.get("SELECT * FROM messages WHERE id = ?", [messageId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.status(200).json(row);
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  });
});


router.put('/messages/:id', (req, res) => {
  const messageId = req.params.id;
  const { response } = req.body;
  const stmt = db.prepare("UPDATE messages SET response = ? WHERE id = ?");
  stmt.run(response, messageId, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Response sent successfully" });
  });
  stmt.finalize();
});

module.exports = router;

