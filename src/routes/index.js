const express = require('express');
const router = express.Router();
const db = require('../config/db');

// test ruta
router.get('/test', async (req, res) => {
  try {
    const data = await db.one('SELECT $1 AS value', ['Radi']); // mora u array
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ruta za korisnike
router.get('/users', async (req, res) => {
  try {
    const users = await db.any('SELECT * FROM users'); // vraća array
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
