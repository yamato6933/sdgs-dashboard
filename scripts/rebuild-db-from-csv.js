// csvファイルから簡単にdbファイルを作成するのに使用

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const csvPath = path.join(dataDir, 'df_scores_mod.csv');
const dbPath = path.join(dataDir, 'new_sdgs_scores.db');

console.log('Starting database rebuild from CSV...');
console.log('CSV file:', csvPath);
console.log('Database file:', dbPath);

// Simple CSV parser
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = values[idx];
    });
    records.push(record);
  }
  return records;
}

try {
  // Read CSV file
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parseCSV(fileContent);

  console.log(`Read ${records.length} records from CSV`);

  // Delete existing database
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Deleted existing database');
  }

  // Create new database
  const db = new Database(dbPath);

  // Create table
  db.exec(`
    CREATE TABLE sdgs_scores (
      id INTEGER PRIMARY KEY,
      municipality TEXT NOT NULL,
      goal_1 REAL, goal_2 REAL, goal_3 REAL, goal_4 REAL, goal_5 REAL,
      goal_6 REAL, goal_7 REAL, goal_8 REAL, goal_9 REAL, goal_10 REAL,
      goal_11 REAL, goal_12 REAL, goal_13 REAL, goal_14 REAL, goal_15 REAL,
      goal_16 REAL, goal_17 REAL
    );
  `);

  console.log('Created table');

  // Prepare insert statement
  const stmt = db.prepare(`
    INSERT INTO sdgs_scores (
      municipality,
      goal_1, goal_2, goal_3, goal_4, goal_5, goal_6, goal_7, goal_8, goal_9, goal_10,
      goal_11, goal_12, goal_13, goal_14, goal_15, goal_16, goal_17
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Insert records
  const transaction = db.transaction((records) => {
    for (const record of records) {
      stmt.run(
        record.city,
        parseFloat(record.goal1) || 0,
        parseFloat(record.goal2) || 0,
        parseFloat(record.goal3) || 0,
        parseFloat(record.goal4) || 0,
        parseFloat(record.goal5) || 0,
        parseFloat(record.goal6) || 0,
        parseFloat(record.goal7) || 0,
        parseFloat(record.goal8) || 0,
        parseFloat(record.goal9) || 0,
        parseFloat(record.goal10) || 0,
        parseFloat(record.goal11) || 0,
        parseFloat(record.goal12) || 0,
        parseFloat(record.goal13) || 0,
        parseFloat(record.goal14) || 0,
        parseFloat(record.goal15) || 0,
        parseFloat(record.goal16) || 0,
        parseFloat(record.goal17) || 0
      );
    }
  });

  transaction(records);
  console.log(`Inserted ${records.length} records into database`);

  // Verify data
  const count = db.prepare('SELECT COUNT(*) as count FROM sdgs_scores').get();
  console.log(`Database now contains ${count.count} records`);

  // Show sample data
  const sample = db.prepare('SELECT * FROM sdgs_scores LIMIT 3').all();
  console.log('\nSample data:');
  sample.forEach(row => {
    console.log(`  - ${row.municipality}: goal1=${row.goal_1}`);
  });

  db.close();
  console.log('\n✅ Database rebuild completed successfully!');
} catch (error) {
  console.error('❌ Error rebuilding database:', error);
  process.exit(1);
}
