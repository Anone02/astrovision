import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import pool from './db/index.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AstroVision API Running 🚀');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

app.get('/asteroids/today', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM asteroids
      WHERE approach_date = CURRENT_DATE
      ORDER BY magnitude ASC
    `);

    res.json({
      count: result.rows.length,
      data: result.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/asteroids', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM asteroids
      ORDER BY approach_date DESC
    `);

    res.json({
      count: result.rows.length,
      data: result.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});