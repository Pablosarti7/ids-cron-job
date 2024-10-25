// app.js
import 'dotenv/config';
import express from 'express';
import pkg from 'pg';
import cron from 'node-cron';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const app = express();

async function deleteOldRecords() {
  try {
    await pool.query('DELETE FROM assistants');
    await pool.query('DELETE FROM threads');
    console.log('Old assistant and thread records deleted successfully.');
  } catch (error) {
    console.error('Error deleting old records:', error);
  }
}

// Schedule the task to run every day at midnight
cron.schedule('30 20 * * *', () => {
  console.log('Running scheduled task to delete old records...');
  deleteOldRecords();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});