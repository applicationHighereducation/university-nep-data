import pool from "../config/db.js";
import getCurrentSession from "../utils/generateSession.js";

export const insertDataService = async(u_id,total,registeredStudents,uploadedStudents,moocCnt,moocManualCnt) => {
  const session = getCurrentSession()
  const query = await pool.query('SELECT * FROM abc_apaar WHERE u_id = $1 AND session = $2', [u_id,session])

  if(query.rows.length === 0){
  const result = await pool.query('INSERT INTO abc_apaar (u_id,session,total_students,registered_count,upload_count,mooc_abc_count,mooc_manual_count) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [u_id,session,total,registeredStudents,uploadedStudents,moocCnt,moocManualCnt])
  return result.rows[0]
  } else {
    const result = await pool.query(
  `UPDATE abc_apaar
   SET total_students = $1,
       registered_count = $2,
       upload_count = $3,
       mooc_abc_count = $4,
       mooc_manual_count = $5
   WHERE u_id = $6 AND session = $7
   RETURNING *`,
  [total, registeredStudents, uploadedStudents, moocCnt, moocManualCnt, u_id, session]
);
return result.rows[0];
  }
}

export const fetchDataService = async(u_id) => {
  const session = getCurrentSession()
  const result = await pool.query('SELECT * FROM abc_apaar WHERE u_id = $1 AND session = $2', [u_id,session])
  return result.rows[0]
} 


