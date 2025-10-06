import pool from '../config/db.js'

export const getCurrentSession = () => {
    const today = new Date();
  const year = today.getFullYear();

  const startDate = new Date(year, 6, 1); 
  const endDate = new Date(year + 1, 5, 30); 

  return today >= startDate && today <= endDate ? year : year - 1;
}

export const setSection1Service = async (u_id, ug_appear_1yr_count, ug_exit_1yr_percent, ug_enter_2yr_count, ug_appear_2yr_count, ug_exit_2yr_percent) => {
    const session = getCurrentSession();

    const result = await pool.query('SELECT * FROM me_exit_ug WHERE u_id = $1 AND session = $2', [u_id, session]);
    if (result.rows.length !== 0) {
    const data = await pool.query(
      'UPDATE me_exit_ug SET ug_appear_1yr_count = $1, ug_exit_1yr_percent = $2, ug_enter_2yr_count = $3, ug_appear_2yr_count = $4, ug_exit_2yr_percent = $5 WHERE u_id = $6 AND session = $7 RETURNING *',
      [ ug_appear_1yr_count, ug_exit_1yr_percent, ug_enter_2yr_count, ug_appear_2yr_count, ug_exit_2yr_percent, u_id, session ]
    );
    return data.rows[0];
  } else {
    const data = await pool.query(
      'INSERT INTO me_exit_ug (u_id, session, ug_appear_1yr_count, ug_exit_1yr_percent, ug_enter_2yr_count, ug_appear_2yr_count, ug_exit_2yr_percent) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [u_id, session, ug_appear_1yr_count, ug_exit_1yr_percent, ug_enter_2yr_count, ug_appear_2yr_count, ug_exit_2yr_percent]
    );
    return data.rows[0];
  }
}

export const setSection2Service = async (u_id, ug_enter_3yr_count, ug_appear_3yr_count, ug_exit_3yr_percent,  ug_enter_4yr_percent) => {
    const session = getCurrentSession();
    const result = await pool.query('UPDATE me_exit_ug SET ug_enter_3yr_count = $1, ug_appear_3yr_count = $2, ug_exit_3yr_percent = $3, ug_enter_4yr_percent = $4 WHERE u_id = $5 AND session = $6 RETURNING *' , [ug_enter_3yr_count, ug_appear_3yr_count, ug_exit_3yr_percent, ug_enter_4yr_percent, u_id, session]);
    return result.rows[0];
}

export const getSection1Service = async (u_id) => {
    const session = getCurrentSession();
    const result = await pool.query('SELECT ug_appear_1yr_count, ug_exit_1yr_percent, ug_enter_2yr_count, ug_appear_2yr_count, ug_exit_2yr_percent FROM me_exit_ug WHERE u_id = $1 AND session = $2', [u_id, session]);
    return result.rows[0];
}

export const getSection2Service = async (u_id) => {
    const session = getCurrentSession();
    const result = await pool.query('SELECT ug_enter_3yr_count, ug_appear_3yr_count, ug_exit_3yr_percent,  ug_enter_4yr_percent FROM me_exit_ug WHERE u_id = $1 AND session = $2', [u_id, session]);
    return result.rows[0];
}