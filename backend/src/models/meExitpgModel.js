import pool from '../config/db.js'

export const getCurrentSession = () => {
    const today = new Date();
  const year = today.getFullYear();

  const startDate = new Date(year, 6, 1); 
  const endDate = new Date(year + 1, 5, 30); 

  return today >= startDate && today <= endDate ? year : year - 1;
}

export const setSection1Service = async (u_id, pg_appear_1yr_count, pg_exit_1yr_percent, pg_enter_2yr_after4yrhonour_count, pg_enter_2yr_afterexit_count) => {
    const session = getCurrentSession();

    const result = await pool.query('SELECT * FROM me_exit_pg WHERE u_id = $1 AND session = $2', [u_id, session]);
    if (result.rows.length !== 0) {
    const data = await pool.query(
      'UPDATE me_exit_pg SET pg_appear_1yr_count = $1, pg_exit_1yr_percent = $2, pg_enter_2yr_after4yrhons = $3, pg_enter_2yr_afterexit_count = $4 WHERE u_id = $5 AND session = $6 RETURNING *',
      [ pg_appear_1yr_count, pg_exit_1yr_percent, pg_enter_2yr_after4yrhonour_count, pg_enter_2yr_afterexit_count, u_id, session ]
    );
    return data.rows[0];
  } else {
    const data = await pool.query(
      'INSERT INTO me_exit_pg (u_id, session, pg_appear_1yr_count, pg_exit_1yr_percent, pg_enter_2yr_after4yrhons, pg_enter_2yr_afterexit_count) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [u_id, session, pg_appear_1yr_count, pg_exit_1yr_percent, pg_enter_2yr_after4yrhonour_count, pg_enter_2yr_afterexit_count]
    );
    return data.rows[0];
  }
}

export const getSection1Service = async (u_id) => {
    const session = getCurrentSession();
    const result = await pool.query('SELECT * FROM me_exit_pg WHERE u_id = $1 AND session = $2', [u_id, session]);
    return result.rows[0] ? result.rows[0] : null;
}

