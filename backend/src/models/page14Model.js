import pool from "../config/db.js";
import getCurrentSession from "../utils/generateSession.js";

export const insertEntryExitDataService = async(u_id,exitCount,entryCount) => {
  const session = getCurrentSession()
  const query = await pool.query('SELECT * FROM entry_exit_data WHERE u_id = $1 AND session = $2', [u_id,session])

  if(query.rows.length === 0){
  const result = await pool.query('INSERT INTO entry_exit_data (u_id,session,student_exit_percent,student_entry_count) VALUES ($1,$2,$3,$4) RETURNING *', [u_id,session,exitCount,entryCount])
  return result.rows[0]
  } else {
    const result = await pool.query('UPDATE entry_exit_data SET student_exit_percent = $1, student_entry_count = $2 WHERE u_id = $3 and session = $4 RETURNING *', [exitCount, entryCount, u_id,session])
    return result.rows[0]
  }
}

export const fetchDataService = async(u_id) => {
  const session = getCurrentSession()
  const result = await pool.query('SELECT * FROM entry_exit_data WHERE u_id = $1 AND session = $2', [u_id,session])
  return result.rows
} 