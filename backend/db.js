const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smartplace',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initDB = async () => {
  // First, connect without database to create it if it doesn't exist
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });
  const dbName = process.env.DB_NAME || 'smartplace';
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
  await connection.end();

  // Now create tables inside smartplace
  const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartplace',
  });

  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(100),
      role VARCHAR(20),
      cgpa FLOAT
    )`,
    `CREATE TABLE IF NOT EXISTS drives (
      id VARCHAR(50) PRIMARY KEY,
      company VARCHAR(100),
      role VARCHAR(100),
      ctc VARCHAR(50),
      eligibility VARCHAR(100),
      status VARCHAR(20),
      date VARCHAR(50),
      rounds JSON
    )`,
    `CREATE TABLE IF NOT EXISTS applications (
      id VARCHAR(50) PRIMARY KEY,
      driveId VARCHAR(50),
      studentId VARCHAR(50),
      studentName VARCHAR(100),
      email VARCHAR(100),
      rollNumber VARCHAR(50),
      branch VARCHAR(50),
      cgpa FLOAT,
      appliedAt VARCHAR(50)
    )`,
    `CREATE TABLE IF NOT EXISTS internships (
      id VARCHAR(50) PRIMARY KEY,
      company VARCHAR(100),
      role VARCHAR(100),
      stipend VARCHAR(50),
      duration VARCHAR(50),
      eligibility VARCHAR(100),
      status VARCHAR(20),
      deadline VARCHAR(50),
      mode VARCHAR(50),
      location VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS internship_applications (
      id VARCHAR(50) PRIMARY KEY,
      internshipId VARCHAR(50),
      studentId VARCHAR(50),
      studentName VARCHAR(100),
      email VARCHAR(100),
      rollNumber VARCHAR(50),
      branch VARCHAR(50),
      cgpa FLOAT,
      appliedAt VARCHAR(50)
    )`,
  ];

  for (let q of queries) {
    await db.query(q);
  }

  // Gracefully add optional profile columns if missing
  const addColumns = [
    `ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT ''`,
    `ALTER TABLE users ADD COLUMN branch VARCHAR(50) DEFAULT 'CS'`,
    `ALTER TABLE users ADD COLUMN roll_number VARCHAR(50) DEFAULT ''`,
    `ALTER TABLE users ADD COLUMN resume_url VARCHAR(255) DEFAULT ''`,
    `ALTER TABLE applications ADD COLUMN phone VARCHAR(20) DEFAULT ''`,
    `ALTER TABLE applications ADD COLUMN resume_url VARCHAR(255) DEFAULT ''`,
    `ALTER TABLE internship_applications ADD COLUMN phone VARCHAR(20) DEFAULT ''`,
    `ALTER TABLE internship_applications ADD COLUMN resume_url VARCHAR(255) DEFAULT ''`
  ];
  for (let query of addColumns) {
    try {
      await db.query(query);
    } catch (err) {
      // Ignored: Column probably already exists.
    }
  }
  
  // Seed initial user if not exists
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@smartplace.com']);
  if (rows.length === 0) {
    await db.query('INSERT INTO users (id, name, email, password, role, cgpa) VALUES (?, ?, ?, ?, ?, ?)', 
      ['u_admin', 'Admin Officer', 'admin@smartplace.com', 'admin123', 'officer', 0]);
  }
  // Seed demo student
  const [studentRows] = await db.query('SELECT * FROM users WHERE email = ?', ['student@demo.com']);
  if (studentRows.length === 0) {
    await db.query('INSERT INTO users (id, name, email, password, role, cgpa) VALUES (?, ?, ?, ?, ?, ?)', 
      ['u_student', 'Demo Student', 'student@demo.com', 'student123', 'student', 8.5]);
  }

  // Also pre-fill some dummy drives so the dashboard looks good
  const [drivesRows] = await db.query('SELECT * FROM drives');
  if (drivesRows.length === 0) {
    await db.query('INSERT INTO drives (id, company, role, ctc, eligibility, status, date, rounds) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['d_demo1', 'Google', 'SDE', '34 LPA', 'CGPA >= 8', 'Open', '2026-06-15', '["Aptitude", "Technical", "HR"]']);
  }

  // Dummy internships
  const [internRows] = await db.query('SELECT * FROM internships');
  if (internRows.length === 0) {
    await db.query('INSERT INTO internships (id, company, role, stipend, duration, eligibility, status, deadline, mode, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['i_demo1', 'Amazon', 'SDE Intern', '80K/month', '6 Months', 'CGPA >= 7.5', 'Open', '2026-05-20', 'Hybrid', 'Bangalore']);
  }

  console.log("Database initialized successfully!");
  return db;
};

module.exports = { pool, initDB };
