import pool from "../config/db.js";

export const getNextProgramId = async (d_id) => {
  const result = await pool.query('SELECT MAX(p_id::int) AS max FROM program_data')
  const maxId = result.rows[0].max;
  return maxId ? parseInt(maxId) + 1 : 1;
};


export const createNewProgramService = async(u_id,f_id,d_id,name,duration,pt_id) => {
  const nextPId = await getNextProgramId(d_id);
  const result = await pool.query('INSERT INTO program_data (u_id,f_id,d_id,p_id,name,duration,pt_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',[u_id,f_id,d_id,nextPId,name,duration,pt_id])
  return result.rows[0]
}

export const getAllProgramsByDepartmentService = async(d_id) => {
  const result = await pool.query('SELECT * from program_data WHERE d_id = $1', [d_id])
  return result.rows
}

export const deleteProgramService = async(p_id) => {
  const result = await pool.query('DELETE from program_data where p_id = $1 RETURNING *', [p_id])
  return result.rows[0]
}

export const getUGProgramsService = async(pt_id, u_id) => {
  const result = await pool.query("SELECT * FROM program_data where pt_id = $1 and u_id = $2", [pt_id, u_id])
  return result.rows
}