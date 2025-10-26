import pool from '../config/db.js';
import  getCurrentSession from '../utils/generateSession.js';

export const setSection1Service = async (
    u_id,
    proj_morethan10cr_count,
    proj_between1to10cr_count,
    proj_between50lto1cr_count,
    proj_between10lto50l_count,
    proj_lessthan10l_count
) => {
    const session = getCurrentSession();


    const existing = await pool.query(
        'SELECT * FROM research_outcome WHERE u_id = $1 AND session = $2',
        [u_id, session]
    );

    let data;
    if (existing.rows.length > 0) {
        data = await pool.query(
            `UPDATE research_outcome 
             SET proj_morethan10cr_count = $1, 
                 proj_between1to10cr_count = $2, 
                 proj_between50lto1cr_count = $3, 
                 proj_between10lto50l_count = $4, 
                 proj_lessthan10l_count = $5
             WHERE u_id = $6 AND session = $7
             RETURNING *`,
            [
                proj_morethan10cr_count,
                proj_between1to10cr_count,
                proj_between50lto1cr_count,
                proj_between10lto50l_count,
                proj_lessthan10l_count,
                u_id,
                session
            ]
        );
    } else {
        data = await pool.query(
            `INSERT INTO research_outcome (
                u_id, session, proj_morethan10cr_count, proj_between1to10cr_count,
                proj_between50lto1cr_count, proj_between10lto50l_count, proj_lessthan10l_count
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                u_id,
                session,
                proj_morethan10cr_count,
                proj_between1to10cr_count,
                proj_between50lto1cr_count,
                proj_between10lto50l_count,
                proj_lessthan10l_count
            ]
        );
    }

    return data.rows[0];
};

export const getSection1Service = async (u_id) => {
    const session = getCurrentSession();
    const result = await pool.query('SELECT proj_morethan10cr_count, proj_between1to10cr_count, proj_between50lto1cr_count, proj_between10lto50l_count, proj_lessthan10l_count FROM research_outcome WHERE u_id = $1 AND session = $2',
        [u_id, session]
    );
    return result.rows[0];
}

export const setSection2Service = async (u_id, industry_funded_proj_count, ngo_funded_proj_count, sci_paper_count, esci_paper_count, scopus_paper_count, q1_count, q2_count, q3_count, q4_count, peer_reviewed_count, institute_hindex) => {
    const session = getCurrentSession();
    const result = await pool.query('UPDATE research_outcome SET industry_funded_proj_count = $1, ngo_funded_proj_count = $2, sci_paper_count = $3, esci_paper_count = $4, scopus_paper_count = $5, q1_count = $6, q2_count = $7, q3_count = $8, q4_count = $9, peer_reviewed_count = $10, institute_hindex = $11 WHERE u_id = $12 AND session = $13 RETURNING *',
        [industry_funded_proj_count, ngo_funded_proj_count, sci_paper_count, esci_paper_count, scopus_paper_count, q1_count, q2_count, q3_count, q4_count, peer_reviewed_count, institute_hindex, u_id, session]
    );
    return result.rows[0];
}

export const getSection2Service = async (u_id) => {
    const session = getCurrentSession();
    const result = await pool.query('SELECT industry_funded_proj_count, ngo_funded_proj_count, sci_paper_count, esci_paper_count, scopus_paper_count, q1_count, q2_count, q3_count, q4_count, peer_reviewed_count, institute_hindex FROM research_outcome WHERE u_id = $1 AND session = $2',
        [u_id, session]
    );
    return result.rows[0];
}
