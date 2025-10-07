import pool from '../config/db.js'

export const getCurrentSession = () => {
    const today = new Date();
  const year = today.getFullYear();

  const startDate = new Date(year, 6, 1); 
  const endDate = new Date(year + 1, 5, 30); 

  return today >= startDate && today <= endDate ? year : year - 1;
}

export const setSection1Service = async (
  u_id,
  Courses_Global_Interdependence_Count,
  Courses_Global_Competencies_Count,
  Courses_Universal_Values_Count,
  Courses_active_citizenship_Count,
  Courses_Global_Interdependence_Percent,
  Courses_Global_Competencies_Percent,
  Courses_Universal_Values_Percent,
  Courses_active_citizenship_Percent
) => {
  const session = getCurrentSession();

  const result = await pool.query(
    'SELECT * FROM Global_Citizenship WHERE u_id = $1 AND session = $2',
    [u_id, session]
  );

  if (result.rows.length !== 0) {
    // Update existing record
    const data = await pool.query(
      `UPDATE Global_Citizenship 
       SET 
         Courses_Global_Interdependence_Count = $1,
         Courses_Global_Competencies_Count = $2,
         Courses_Universal_Values_Count = $3,
         Courses_active_citizenship_Count = $4,
         Courses_Global_Interdependence_Percent = $5,
         Courses_Global_Competencies_Percent = $6,
         Courses_Universal_Values_Percent = $7,
         Courses_active_citizenship_Percent = $8
       WHERE u_id = $9 AND session = $10 
       RETURNING *`,
      [
        Courses_Global_Interdependence_Count,
        Courses_Global_Competencies_Count,
        Courses_Universal_Values_Count,
        Courses_active_citizenship_Count,
        Courses_Global_Interdependence_Percent,
        Courses_Global_Competencies_Percent,
        Courses_Universal_Values_Percent,
        Courses_active_citizenship_Percent,
        u_id,
        session,
      ]
    );
    return data.rows[0];
  } else {
    // Insert new record
    const data = await pool.query(
      `INSERT INTO Global_Citizenship (
         u_id, session,
         Courses_Global_Interdependence_Count,
         Courses_Global_Competencies_Count,
         Courses_Universal_Values_Count,
         Courses_active_citizenship_Count,
         Courses_Global_Interdependence_Percent,
         Courses_Global_Competencies_Percent,
         Courses_Universal_Values_Percent,
         Courses_active_citizenship_Percent
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        u_id,
        session,
        Courses_Global_Interdependence_Count,
        Courses_Global_Competencies_Count,
        Courses_Universal_Values_Count,
        Courses_active_citizenship_Count,
        Courses_Global_Interdependence_Percent,
        Courses_Global_Competencies_Percent,
        Courses_Universal_Values_Percent,
        Courses_active_citizenship_Percent,
      ]
    );
    return data.rows[0];
  }
};

export const getSection1Service = async (u_id) => {
  const session = getCurrentSession();

  const result = await pool.query(
    `SELECT 
       Courses_Global_Interdependence_Count,
       Courses_Global_Competencies_Count,
       Courses_Universal_Values_Count,
       Courses_active_citizenship_Count,
       Courses_Global_Interdependence_Percent,
       Courses_Global_Competencies_Percent,
       Courses_Universal_Values_Percent,
       Courses_active_citizenship_Percent
     FROM Global_Citizenship 
     WHERE u_id = $1 AND session = $2`,
    [u_id, session]
  );

  if (result.rows.length === 0) return null;
  return result.rows[0];
};