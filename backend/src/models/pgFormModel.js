import pool from '../config/db.js'
import getCurrentSession from '../utils/generateSession.js';

export const getTotalProgramsService = async(u_id) => {
  const result = await pool.query('SELECT COUNT(*) FROM program_data WHERE u_id = $1 and pt_id = $2', [u_id,2]);
  return parseInt(result.rows[0].count, 10);
}

export const getPGProgramsService = async(u_id) => {
  const result = await pool.query('select name from program_data where pt_id = $1 and u_id = $2', [2,u_id])
  return result.rows
}



export const getProgramIdService = async (names) => {
  if (!names || names.length === 0) return [];

  const placeholders = names.map((_, index) => `$${index + 1}`).join(', ');
  const query = `SELECT p_id, name FROM program_data WHERE name IN (${placeholders})`;
  const result = await pool.query(query, names);
  return result.rows;
};

export const setSection1Service = async (u_id, follow, count_ccfpp, pg_other_count) => {
  const session = getCurrentSession();
  const followStatus = follow;

  const result = await pool.query(
    'SELECT * FROM pg_framework WHERE u_id = $1 AND session = $2',
    [u_id, session]
  );

  if (result.rows.length !== 0) {
    const data = await pool.query(
      'UPDATE pg_framework SET ccfpp_follow = $1, ccfpp_count = $2 , session = $3, pg_other_count = $4 WHERE u_id = $5 RETURNING *',
      [followStatus, count_ccfpp, session, pg_other_count, u_id]
    );
    return data.rows[0];
  } else {
    const data = await pool.query(
      'INSERT INTO pg_framework (u_id, ccfpp_follow, ccfpp_count , session, pg_other_count) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [u_id, followStatus, count_ccfpp, session, pg_other_count]
    );
    return data.rows[0];
  }
};

export const setSection2Service = async (u_id, count_regulating, count_2year) => {
  const session = getCurrentSession();
  const result = await pool.query(
    'UPDATE pg_framework SET pg_only_reg_council_count = $1 ,  two_year_count  = $2 WHERE u_id = $3 AND session = $4 RETURNING *',
    [count_regulating, count_2year, u_id, session]
  );
  return result.rows[0];
};

export const setSection3Service = async (u_id, count_1year, count_5year_integrated) => {
  const session = getCurrentSession();
  const result = await pool.query(
    'UPDATE pg_framework SET one_year_count = $1 , five_year_count = $2 WHERE u_id = $3 and session = $4 RETURNING *',
    [count_1year, count_5year_integrated, u_id, session]
  );
  return result.rows[0];
};


const insertProgramsByType = async (u_id, programIds, pl_id) => {
  const session = getCurrentSession()
  console.log(`Inserting into ${pl_id}. Received programIds:`, programIds);

  // 1. Delete all if empty
  if (!programIds || programIds.length === 0) {
    const result = await pool.query(
      'DELETE FROM program_list WHERE u_id = $1 AND pl_id = $2',
      [u_id, pl_id]
    );
    console.log(`All programs deleted for u_id=${u_id}, pl_id=${pl_id}`);
    return result.rows;
  }

  // 2. Get existing program IDs
  const existing = await pool.query(
    'SELECT p_id FROM program_list WHERE u_id = $1 AND pl_id = $2 AND session = $3',
    [u_id, pl_id, session]
  );
  const existingIds = existing.rows.map((row) => row.p_id);

  // 3. Compare sets
  const newProgramIds = programIds.filter((p_id) => !existingIds.includes(p_id));
  const deletedProgramIds = existingIds.filter(
    (p_id) => !programIds.includes(p_id)
  );

  // 4. Delete removed ones
  if (deletedProgramIds.length > 0) {
    await pool.query(
      'DELETE FROM program_list WHERE u_id = $1 AND p_id = ANY($2::int[]) AND pl_id = $3 AND session = $4',
      [u_id, deletedProgramIds, pl_id, session]
    );
    console.log('Deleted programs:', deletedProgramIds);
  }

  // 5. Insert new ones
  if (newProgramIds.length === 0) {
    console.log('No new programs found');
    return [];
  }

  const values = [];
  const placeholders = newProgramIds
    .map((p_id, index) => {
      const base = index * 4;
      values.push(u_id, p_id, pl_id, session);
      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base+4})`;
    })
    .join(', ');

  const insertQuery = `
    INSERT INTO program_list (u_id, p_id, pl_id, session)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log('Inserted programs:', newProgramIds);
  return result.rows;
};

export const insertpgCCFUGPService = (u_id, programIds) => insertProgramsByType(u_id, programIds, 'CCFPP_PG');
export const insertpgOtherThanCCFUGPService = (u_id, programIds) => insertProgramsByType(u_id, programIds, 'OtherThanCCFUGP_PG');
export const insertRegulatingProgramsService = (u_id, programIds) => insertProgramsByType(u_id, programIds, 'RegulatingCouncil_PG');
export const insert2YearpgService = (u_id, programIds) => insertProgramsByType(u_id, programIds, '2Year_PG');
export const insert1YearpgService = (u_id, programIds) => insertProgramsByType(u_id, programIds, '1Year_PG');
export const insert5YearIntegratedpgService = (u_id, programIds) => insertProgramsByType(u_id, programIds, '5YearIntegrated_PG');