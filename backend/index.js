require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL DB');
});

db.query(`
  CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    job VARCHAR(255),
    salary DECIMAL(10, 2)
  )
`, (err) => {
  if (err) throw err;
  console.log('✅ Employees table ready');
});

// ✅ POST - create
app.post('/employees', (req, res) => {
  const { name, email, job, salary } = req.body;
  db.query(
    'INSERT INTO employees (name, email, job, salary) VALUES (?, ?, ?, ?)',
    [name, email, job, salary],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Insert error');
      } else {
        res.status(201).json({ id: result.insertId, name, email, job, salary });
      }
    }
  );
});

// ✅ GET - read all
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

// ✅ PUT - update by ID
app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, job, salary } = req.body;

  db.query(
    'UPDATE employees SET name = ?, email = ?, job = ?, salary = ? WHERE id = ?',
    [name, email, job, salary, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Update error');
      } else {
        if (result.affectedRows === 0) {
          res.status(404).send('Employee not found');
        } else {
          res.json({ id, name, email, job, salary });
        }
      }
    }
  );
});

// ✅ DELETE - delete by ID
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM employees WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Delete error');
    } else {
      if (result.affectedRows === 0) {
        res.status(404).send('Employee not found');
      } else {
        res.sendStatus(204); // No Content
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
