const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const router = require('./routes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);

const SECRET_KEY = 'eis';
let db;
beforeAll((done) => {
  db = new sqlite3.Database(':memory:');
  db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, role TEXT)");
    db.run("CREATE TABLE dogs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, breed TEXT, age INTEGER, description TEXT, image TEXT)");
    db.run("CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, dogId INTEGER, message TEXT, response TEXT)");
    db.run("CREATE TABLE favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, dogId INTEGER)");
    done();
  });
});

afterAll((done) => {
  db.close();
  done();
});

describe('POST /api/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: 'test3@test.com', password: 'password', role: 'user' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });
});

describe('POST /api/login', () => {
  it('should login a user', async () => {
    await request(app)
      .post('/api/register')
      .send({ email: 'login@test.com', password: 'password', role: 'user' });

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'login@test.com', password: 'password' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token');
  });
});

describe('GET /api/dogs/:id', () => {
  it('should return dog details', async () => {
 

    const res = await request(app)
      .get(`/api/dogs/1`);

      console.log(res,"DOGS");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Buddy');
  });
});

describe('POST /api/messages', () => {
  it('should send a message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({ userId: 1, dogId: 1, message: 'I am interested in this dog' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Message sent successfully');
  });
});

describe('GET /api/messages', () => {
  it('should return all messages', async () => {
    const res = await request(app)
      .get('/api/messages');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
