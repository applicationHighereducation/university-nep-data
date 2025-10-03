import pool from "../config/db.js";


export const getAllFacultyService = async (u_id) => {
  const result = await pool.query('SELECT * FROM faculty_data WHERE u_id = $1 ORDER BY f_id ASC', [u_id]);
  return result.rows;
};


export const getFacultyByIdService = async (f_id) => {
  const result = await pool.query('SELECT * FROM faculty_data WHERE f_id = $1', [f_id]);
  return result.rows[0]; 
};

export const getNextf_id = async (u_id) => {
  const result = await pool.query('SELECT MAX(f_id::int) AS max FROM faculty_data');
  let maxId = result.rows[0].max;
  if (!maxId) {
    return 1;
  }
  return parseInt(maxId) + 1;
};


export const createFacultyService = async (u_id,name) => {
  const nextf_id = await getNextf_id(u_id)
  const result = await pool.query(
    'INSERT INTO faculty_data (f_id,name,u_id) VALUES ($1,$2,$3) RETURNING *',
    [nextf_id,name,u_id]
  );
  console.log(result)
  return result.rows[0];
};


export const deleteFacultyService = async (f_id) => {
  const result = await pool.query(
    'DELETE FROM faculty_data WHERE f_id = $1 RETURNING *',
    [f_id]
  );
  return result.rows[0];
};

export const getFacultyIdByNameService = async(name) => {
  const result = await pool.query('SELECT f_id FROM faculty_data WHERE name = $1', [name])
  return result.rows[0]
}

//this is for deptModel


export const getFacultyByNameAndUniversityService = async (name, u_id, client = pool) => {
  const result = await client.query(
    'SELECT * FROM faculty_data WHERE name = $1 AND u_id = $2',
    [name, u_id]
  );
  return result.rows[0];
};