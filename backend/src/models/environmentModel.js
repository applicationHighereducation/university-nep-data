import pool from '../config/db.js'
import getCurrentSession from '../utils/generateSession.js';

export const setSection1Service = async (u_id, prog_name, course_name, assessment_weight) => {
    const session = getCurrentSession();
    const result = await pool.query('INSERT INTO environment_ed (p_id, u_id, session, course_name, assessment_weight) SELECT p.p_id, $2, $3, $4, $5 FROM program_data p WHERE p.name = $1 AND p.u_id = $6 RETURNING *',
        [prog_name, u_id, session, course_name, assessment_weight, u_id]
    );
    return result.rows[0];
}

export const getSection1Service = async (u_id, prog_name) => {
    const session = getCurrentSession();
    const result = await pool.query('SELECT ee.course_name, ee.assessment_weight FROM environment_ed ee JOIN program_data p ON ee.p_id = p.p_id WHERE p.u_id = $1 AND ee.u_id = $1 AND p.name = $2 AND ee.session = $3',
        [u_id, prog_name, session]
    );
    return result.rows;
}

export const getprogramfromtypeService = async (u_id, pt_name) => {
    const result = await pool.query(
        'SELECT p.name FROM program_data p JOIN program_type pt ON p.pt_id = pt.pt_id WHERE pt.pt_name = $1 AND p.u_id = $2',
        [pt_name, u_id]
    );
    return result.rows;
}

export const getProgramWithoutEnvironmentService = async (u_id) => {
    const session = getCurrentSession();
    const result = await pool.query(
        'SELECT DISTINCT p.name FROM program_data p LEFT JOIN environment_ed ee ON p.p_id = ee.p_id AND p.u_id = ee.u_id AND ee.session = $2 WHERE p.u_id = $1  AND ee.p_id IS NULL;',
        [u_id, session]
    );
    return result.rows;
}

export const deleteCourseService = async (u_id, prog_name, course_name) => {
    const session = getCurrentSession();
    const result = await pool.query('DELETE FROM environment_ed WHERE p_id = (SELECT p.p_id FROM program_data p WHERE p.name = $1 AND p.u_id = $2) AND u_id = $2 AND session = $3 AND course_name = $4 RETURNING *',
        [prog_name, u_id, session, course_name]
    );
    return result.rows[0];
}
