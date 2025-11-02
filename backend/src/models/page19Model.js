import pool from '../config/db.js';
import getCurrentSession  from '../utils/generateSession.js';

export const setSection19Service = async (u_id, mou_research_count, active_mou_count, signed_inactive_2yr_count, faculty_exchange_count, mou_labusage_count, interdisc_center_count, ongoing_interdisc_research_count ) => {
    const session = getCurrentSession();
    const result = await pool.query('SELECT * FROM research_initiative WHERE u_id = $1 AND session = $2',[u_id, session]);
    if (result.rows.length > 0) {
        const updateResult = await pool.query('UPDATE research_initiative SET mou_research_count = $1, active_mou_count = $2, signed_inactive_2yr_count = $3, faculty_exchange_count = $4, mou_labusage_count = $5, interdisc_center_count = $6, ongoing_interdisc_research_count = $7 WHERE u_id = $8 AND session = $9 RETURNING *',
            [mou_research_count, active_mou_count, signed_inactive_2yr_count, faculty_exchange_count, mou_labusage_count, interdisc_center_count, ongoing_interdisc_research_count, u_id, session]
        );
        return updateResult.rows[0];
    } else {
        const insertResult = await pool.query('INSERT INTO research_initiative (u_id, session, mou_research_count, active_mou_count, signed_inactive_2yr_count, faculty_exchange_count, mou_labusage_count, interdisc_center_count, ongoing_interdisc_research_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [u_id, session, mou_research_count, active_mou_count, signed_inactive_2yr_count, faculty_exchange_count, mou_labusage_count, interdisc_center_count, ongoing_interdisc_research_count]
        );
        return insertResult.rows[0];
    }
};

export const getSection19Service = async (u_id) => {
    const session = getCurrentSession();
    const result = await pool.query('SELECT * from research_initiative WHERE u_id = $1 AND session = $2',
        [u_id, session]
    );
    return result.rows[0];
};
