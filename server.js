const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

// Database initialization function
function initializeDatabase() {
  // Create Kids table
  db.run(`CREATE TABLE IF NOT EXISTS kids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) console.error('Error creating kids table:', err.message);
  });

  // Create Goals table
  db.run(`CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kid_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    baseline_value INTEGER,
    baseline_date DATE,
    target_value INTEGER,
    target_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kid_id) REFERENCES kids (id)
  )`, (err) => {
    if (err) console.error('Error creating goals table:', err.message);
  });

  // Create Measurements table
  db.run(`CREATE TABLE IF NOT EXISTS measurements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id INTEGER NOT NULL,
    value INTEGER NOT NULL,
    description TEXT,
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goal_id) REFERENCES goals (id)
  )`, (err) => {
    if (err) console.error('Error creating measurements table:', err.message);
  });
}

// Routes

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Kids routes
app.get('/kids', (req, res) => {
  db.all('SELECT * FROM kids ORDER BY name', [], (err, kids) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
    res.render('kids', { kids });
  });
});

app.post('/kids', (req, res) => {
  const { name, age, notes } = req.body;
  db.run('INSERT INTO kids (name, age, notes) VALUES (?, ?, ?)', [name, age, notes], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
    res.redirect('/kids');
  });
});

app.get('/kids/:id', (req, res) => {
  const kidId = req.params.id;
  
  // Get kid details
  db.get('SELECT * FROM kids WHERE id = ?', [kidId], (err, kid) => {
    if (err || !kid) {
      console.error(err ? err.message : 'Kid not found');
      return res.status(404).send('Kid not found');
    }
    
    // Get all goals for this kid
    db.all('SELECT * FROM goals WHERE kid_id = ? ORDER BY created_at DESC', [kidId], (err, goals) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
      }
      res.render('kid_detail', { kid, goals });
    });
  });
});

// Goals routes
app.get('/kids/:kidId/goals/new', (req, res) => {
  const kidId = req.params.kidId;
  db.get('SELECT * FROM kids WHERE id = ?', [kidId], (err, kid) => {
    if (err || !kid) {
      return res.status(404).send('Kid not found');
    }
    res.render('goal_form', { kid });
  });
});

app.post('/goals', (req, res) => {
  const { kidId, name, description, baselineValue, baselineDate, targetValue, targetDate } = req.body;
  
  db.run(
    'INSERT INTO goals (kid_id, name, description, baseline_value, baseline_date, target_value, target_date) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [kidId, name, description, baselineValue, baselineDate, targetValue, targetDate],
    function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
      }
      res.redirect(`/kids/${kidId}`);
    }
  );
});

app.get('/goals/:id', (req, res) => {
  const goalId = req.params.id;
  
  // Get goal details
  db.get('SELECT goals.*, kids.name as kid_name FROM goals JOIN kids ON goals.kid_id = kids.id WHERE goals.id = ?', 
    [goalId], (err, goal) => {
      if (err || !goal) {
        console.error(err ? err.message : 'Goal not found');
        return res.status(404).send('Goal not found');
      }
      
      // Get all measurements for this goal
      db.all('SELECT * FROM measurements WHERE goal_id = ? ORDER BY measured_at DESC', 
        [goalId], (err, measurements) => {
          if (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
          }
          res.render('goal_detail', { goal, measurements });
        });
    });
});

// Measurements routes
app.post('/measurements', (req, res) => {
  const { goalId, value, description } = req.body;
  
  db.run(
    'INSERT INTO measurements (goal_id, value, description) VALUES (?, ?, ?)',
    [goalId, value, description],
    function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
      }
      res.redirect(`/goals/${goalId}`);
    }
  );
});

// API endpoints for fetching data for charts
app.get('/api/goals/:id/measurements', (req, res) => {
  const goalId = req.params.id;
  
  db.all(
    'SELECT * FROM measurements WHERE goal_id = ? ORDER BY measured_at ASC',
    [goalId],
    (err, measurements) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(measurements);
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
