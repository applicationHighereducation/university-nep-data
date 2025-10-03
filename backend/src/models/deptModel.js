import pool from "../config/db.js";


export const getNextd_id = async (f_id) => {
  const result = await pool.query('SELECT MAX(d_id::int) AS max FROM department_data');
  let maxId = result.rows[0].max;
  if (!maxId) {
    return 1;
  }
  return parseInt(maxId) + 1;
};

export const createDepartmentService = async (dept_name, u_id, f_id) => {
  const exists = await pool.query(
    "SELECT 1 FROM department_data WHERE LOWER(dept_name) = LOWER($1) AND f_id = $2",
    [dept_name, f_id]
  );

  if (exists.rowCount > 0) {
    throw new ApiError(400, "Department already exists under this faculty");
  }

  if (exists.rowCount > 0) {
    throw new ApiError(400, "Department already exists under this faculty");
  }

  const nextd_id = await getNextd_id()
  const result = await pool.query(
    'INSERT INTO department_data (u_id, f_id, d_id, dept_name) VALUES ($1, $2, $3, $4) RETURNING *',
    [u_id, f_id, nextd_id, dept_name]
  );
  return result.rows[0];
};


export const getAllDepartmentsService = async () => {
  const result = await pool.query('SELECT * FROM department_data ORDER BY d_id ASC');
  return result.rows;
};


export const getDepartmentByIdService = async (f_id) => {
  const result = await pool.query('SELECT * FROM department_data WHERE f_id= $1', [f_id]);
  return result.rows;
};

export const getDepartmentByDepartmentId = async(d_id) => {
  const result = await pool.query('SELECT dept_name FROM department_data WHERE d_id= $1', [d_id]);
  return result.rows[0];
}

export const getDepartmentIdByName = async (dept_name) => {
  const result = await pool.query(
    `SELECT d_id 
     FROM department_data 
     WHERE dept_name = $1`,
    [dept_name]
  );

  // If no department found, return null
  if (result.rows.length === 0) return null;

  return result.rows[0].d_id;
};


export const deleteDepartmentService = async (d_id) => {
  const result = await pool.query(
  'DELETE FROM department_data WHERE d_id = $1 RETURNING *',
  [d_id]
);
  return result.rows[0];
};

export const getDepartmentCountService = async(f_id,u_id) => {
  const result = await pool.query('SELECT COUNT(*) FROM department_data WHERE f_id = $1 AND u_id = $2', [f_id, u_id])
  return result.rows[0]
}

