import pool from "../config/db.js";


const getNextId = async () => {
  const result = await pool.query('SELECT MAX(pt_id::int) AS max FROM program_type');
  let maxId = result.rows[0].max;
  if (!maxId) {
    return 1;
  }
  return parseInt(maxId) + 1;
};

export const createProgramService = async(name) => {
  const id = await getNextId()
  const result = await pool.query('INSERT into program_type (pt_id, pt_name) VALUES ($1,$2) RETURNING *', [id,name])
  return result.rows[0]
}

export const uploadProgramService = async(uid,fid,did,ptid,name,duration) => {
}

export const getProgramTypeIdByName = async (pt_name) => {
  const result = await pool.query(
    `SELECT pt_id 
     FROM program_type 
     WHERE pt_name = $1`,
    [pt_name]
  );

  // If no program type found, return null
  if (result.rows.length === 0) return null;

  return result.rows[0].pt_id;
};

export const getProgramTypeByIdService = async(pt_id) => {
  const result = await pool.query('SELECT pt_name from program_type where pt_id = $1', [pt_id])
  return result.rows[0]
}