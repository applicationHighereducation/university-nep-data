import pool from '../config/db.js'
import getCurrentSession  from '../utils/generateSession.js';

export const setSeatsService = async (u_id, prog_name, year, sanctioned_seats, filled_seats) => {
   const result = await pool.query(
  `INSERT INTO student_seats (p_id, year, u_id, seats_sanction, seats_filled)
   SELECT p.p_id, $2, $3, $4, $5
   FROM program_data p
   WHERE p.name = $1 AND p.u_id = $6
   RETURNING *`,
  [prog_name, year, u_id, sanctioned_seats, filled_seats, u_id]
);

    return result.rows[0];
}

export const getprogramfromtypeService = async (u_id, pt_name) => {
    const result = await pool.query(
        'SELECT p.name FROM program_data p JOIN program_type pt ON p.pt_id = pt.pt_id WHERE pt.pt_name = $1 AND p.u_id = $2',
        [pt_name, u_id]
    );
    return result.rows;
}

export const getSeatRecordService = async (u_id, prog_name) => {
    const session = getCurrentSession();
    const result = await pool.query(
        'SELECT p.name, ss.year, ss.seats_sanction, ss.seats_filled FROM student_seats ss JOIN program_data p ON ss.p_id = p.p_id WHERE p.name = $1 AND p.u_id = $2 AND ss.u_id = $2 AND (ss.year = $3 OR ss.year = $3 - 1 OR ss.year = $3 - 2 OR ss.year = $3 - 3)  ORDER BY ss.year DESC',
        [prog_name, u_id, session]
    );
    return result.rows;
}

export const setStrengthService = async (u_id, prog_name, year, stud_strength) => {
    const session = getCurrentSession();
    const result = await pool.query(
        'INSERT INTO student_strength (p_id, year, u_id, stud_strength, session) SELECT p.p_id, $2, $3, $4, $5 FROM program_data p WHERE p.name = $1 AND p.u_id = $6 RETURNING *',
        [prog_name, year, u_id, stud_strength, session, u_id]
    );
    return result.rows[0];
}

export const getStrengthCountService = async (u_id, prog_name, year) => {
    const session = getCurrentSession();
    const result = await pool.query(
        'SELECT ss.stud_strength FROM student_strength ss JOIN program_data p ON ss.p_id = p.p_id WHERE p.name = $1 AND p.u_id = $2 AND ss.u_id = $2 AND ss.year = $3 AND ss.session = $4-1',
        [prog_name, u_id, year, session]
    );
    return result.rows;
}

export const getStrengthRecordService = async (u_id, prog_name) => {
    const session = getCurrentSession();
    const result = await pool.query(
        'SELECT p.name, ss.year, ss.stud_strength FROM student_strength ss JOIN program_data p ON ss.p_id = p.p_id WHERE p.name = $1 AND p.u_id = $2 AND ss.u_id = $2 AND ss.session = $3 ORDER BY ss.year DESC',
        [prog_name, u_id, session]
    );
    return result.rows;
}

export const deleteSeatRecordService = async (u_id, prog_name, year) => {
    const result = await pool.query(
        'DELETE FROM student_seats WHERE p_id = (SELECT p_id FROM program_data WHERE name = $1 AND u_id = $2) AND year = $3 AND u_id = $2 RETURNING *',
        [prog_name, u_id, year]
    );
    return result.rows[0];
}

export const deleteStrengthRecordService = async (u_id, prog_name, year) => {
    const session = getCurrentSession();
    const result = await pool.query(
        'DELETE FROM student_strength WHERE p_id = (SELECT p_id FROM program_data WHERE name = $1 AND u_id = $2) AND year = $3 AND u_id = $2 AND session = $4 RETURNING *',
        [prog_name, u_id, year, session]
    );
    return result.rows[0];
}
