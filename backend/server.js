require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, initDB } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const multer = require('multer');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));// Auth
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password.' });
    res.json({ token: 'demo-token', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const [exists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (exists.length > 0) return res.status(400).json({ error: 'Account with this email already exists.' });
    
    const id = "uid_" + Math.random().toString(36).substr(2, 9);
    const newUser = { id, name, email, password, role: role || 'student', cgpa: 8.5 };
    await pool.query('INSERT INTO users (id, name, email, password, role, cgpa) VALUES (?, ?, ?, ?, ?, ?)', 
      [newUser.id, newUser.name, newUser.email, newUser.password, newUser.role, newUser.cgpa]);
    
    res.json({ token: 'demo-token', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/users/:id', upload.single('resume'), async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(data)) {
      if (['name', 'phone', 'branch', 'roll_number'].includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (req.file) {
      updates.push(`resume_url = ?`);
      values.push(`/uploads/${req.file.filename}`);
    }

    if (updates.length > 0) {
      values.push(id);
      await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Drives
app.get('/api/drives', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM drives');
    // For drives, parse the JSON rounds array back
    const mapped = rows.map(r => ({ ...r, rounds: typeof r.rounds === 'string' ? JSON.parse(r.rounds) : r.rounds }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/drives', async (req, res) => {
  try {
    const data = req.body;
    const id = "d_" + Math.random().toString(36).substr(2, 9);
    await pool.query('INSERT INTO drives (id, company, role, ctc, eligibility, status, date, rounds) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [id, data.company, data.role, data.ctc, data.eligibility, data.status, data.date, JSON.stringify(data.rounds || [])]);
    res.json({ id, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/drives/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      updates.push(`${key} = ?`);
      values.push(key === 'rounds' ? JSON.stringify(value) : value);
    }
    if (updates.length > 0) {
      values.push(id);
      await pool.query(`UPDATE drives SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    const [rows] = await pool.query('SELECT * FROM drives WHERE id = ?', [id]);
    res.json({ ...rows[0], rounds: typeof rows[0].rounds === 'string' ? JSON.parse(rows[0].rounds) : rows[0].rounds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/drives/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM drives WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Internships
app.get('/api/internships', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM internships');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/internships', async (req, res) => {
  try {
    const data = req.body;
    const id = "i_" + Math.random().toString(36).substr(2, 9);
    await pool.query('INSERT INTO internships (id, company, role, stipend, duration, eligibility, status, deadline, mode, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [id, data.company, data.role, data.stipend, data.duration, data.eligibility, data.status, data.deadline, data.mode, data.location]);
    res.json({ id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/internships/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
    if (updates.length > 0) {
      values.push(id);
      await pool.query(`UPDATE internships SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    const [rows] = await pool.query('SELECT * FROM internships WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/internships/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM internships WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Applications (Jobs)
app.get('/api/applications', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM applications');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { driveId, userId } = req.body;
    const [existing] = await pool.query('SELECT * FROM applications WHERE driveId = ? AND studentId = ?', [driveId, userId]);
    if (existing.length > 0) return res.status(400).json({ error: 'Already applied.' });
    
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const student = users[0];
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const app = {
      id: "a_" + Math.random().toString(36).substr(2, 9),
      driveId,
      studentId: userId,
      studentName: student.name,
      email: student.email,
      rollNumber: student.roll_number || student.id || "N/A",
      branch: student.branch || "CS",
      cgpa: student.cgpa || 0,
      appliedAt: new Date().toISOString().split("T")[0],
      phone: student.phone || "",
      resume_url: student.resume_url || ""
    };
    
    await pool.query('INSERT INTO applications (id, driveId, studentId, studentName, email, rollNumber, branch, cgpa, appliedAt, phone, resume_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [app.id, app.driveId, app.studentId, app.studentName, app.email, app.rollNumber, app.branch, app.cgpa, app.appliedAt, app.phone, app.resume_url]);
    
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Applications (Internships)
app.get('/api/internshipApplications', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM internship_applications');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/internshipApplications', async (req, res) => {
  try {
    const { internshipId, userId } = req.body;
    const [existing] = await pool.query('SELECT * FROM internship_applications WHERE internshipId = ? AND studentId = ?', [internshipId, userId]);
    if (existing.length > 0) return res.status(400).json({ error: 'Already applied.' });
    
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const student = users[0];
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const app = {
      id: "ia_" + Math.random().toString(36).substr(2, 9),
      internshipId,
      studentId: userId,
      studentName: student.name,
      email: student.email,
      rollNumber: student.roll_number || student.id || "N/A",
      branch: student.branch || "CS",
      cgpa: student.cgpa || 0,
      appliedAt: new Date().toISOString().split("T")[0],
      phone: student.phone || "",
      resume_url: student.resume_url || ""
    };
    
    await pool.query('INSERT INTO internship_applications (id, internshipId, studentId, studentName, email, rollNumber, branch, cgpa, appliedAt, phone, resume_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [app.id, app.internshipId, app.studentId, app.studentName, app.email, app.rollNumber, app.branch, app.cgpa, app.appliedAt, app.phone, app.resume_url]);
    
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(console.error);
