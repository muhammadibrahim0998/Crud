// ✅ Load environment variables FIRST
require('dotenv').config();

// ✅ Import packages
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

// ✅ Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Create MySQL connection using .env variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// ✅ Connect to database
db.connect(err => {
  if (err) {
    console.error('❌ DB connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL DB');
});

// ✅ Create table if not exists
db.query(
  `CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    job VARCHAR(255),
    salary DECIMAL(10, 2)
  )`,
  (err) => {
    if (err) throw err;
    console.log('✅ Employees table ready');
  }
);

// ✅ GET all employees
app.get('/employees', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('DB error');
    } else {
      res.json(results);
    }
  });
});

// ✅ POST add employee
app.post('/employees', (req, res) => {
  const { name, email, job, salary } = req.body;

  db.query(
    'INSERT INTO employees (name, email, job, salary) VALUES (?, ?, ?, ?)',
    [name, email, job, salary],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('DB error');
      } else {
        res.status(201).json({ id: result.insertId, name, email, job, salary });
      }
    }
  );
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
