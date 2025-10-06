import pool from '../config/db.js'

export const getTotalProgramsService = async(u_id) => {
  const result = await pool.query('SELECT COUNT(*) FROM program_data WHERE u_id = $1 and pt_id = $2', [u_id,1]);
  return parseInt(result.rows[0].count, 10);
}

export const getCurrentSession = () => {
  const today = new Date();
  const year = today.getFullYear();

  const startDate = new Date(year, 6, 1); 
  const endDate = new Date(year + 1, 5, 30); 

  return today >= startDate && today <= endDate ? year : year - 1;
};

export const getUGProgramDetailsService = async(u_id) => {
  const session = getCurrentSession()
  const result = await pool.query('SELECT * from ug_framework where u_id =$1 and session = $2', [u_id,session])
  return result.rows[0]
}

export const getProgramsService = async(u_id,programId) => {
  const session = getCurrentSession()
  const result = await pool.query('SELECT * from program_list where u_id = $1 and session = $2 and pl_id = $3', [u_id,session,programId])
  return result.rows[0]
}

export const getUniByNameService = async(u_id) => {
  const result = await pool.query('SELECT u_name,u_id FROM university_data WHERE u_id = $1', [u_id])
  return result.rows[0]
}

export const setCCFUGPService = async (u_id, follow, count) => {
  const session = getCurrentSession()
  const followStatus = follow; 

  const result = await pool.query('SELECT * FROM ug_framework WHERE u_id = $1 AND session = $2', [u_id,session]);

  if (result.rows.length !== 0) {
    const data = await pool.query(
      'UPDATE ug_framework SET ccfugp_follow = $1, ccfugp_count = $2, session = $3 WHERE u_id = $4 RETURNING *',
      [followStatus, count, session, u_id]
    );
    return data.rows[0];
  } else {
    const data = await pool.query(
      'INSERT INTO ug_framework (u_id, ccfugp_follow, ccfugp_count, session) VALUES ($1, $2, $3, $4) RETURNING *',
      [u_id, followStatus, count, session]
    );
    return data.rows[0];
  }
};

export const getProgramIdService = async(names) => {
    if(names.length === 0){
      return []
    }
   const placeholders = names.map((_, index) => `$${index + 1}`).join(', ');
    const query = `SELECT p_id, name FROM program_data WHERE name IN (${placeholders})`;
    const result = await pool.query(query, names);
    return result.rows
}



// ð¥ Generic reusable insert function
const insertProgramsByType = async (u_id, programIds, pl_id) => {
  const session = getCurrentSession(); // ✅ Added session handling
  console.log(`Inserting into ${pl_id}. Received programIds:`, programIds, 'Session:', session);

  // 1️⃣ Delete all if empty
  if (!programIds || programIds.length === 0) {
    const result = await pool.query(
      'DELETE FROM program_list WHERE u_id = $1 AND pl_id = $2 AND session = $3',
      [u_id, pl_id, session]
    );
    console.log(`All programs deleted for u_id=${u_id}, pl_id=${pl_id}, session=${session}`);
    return result.rows;
  }

  // 2️⃣ Get existing program IDs (for the current session)
  const existing = await pool.query(
    'SELECT p_id FROM program_list WHERE u_id = $1 AND pl_id = $2 AND session = $3',
    [u_id, pl_id, session]
  );
  const existingIds = existing.rows.map(row => row.p_id);

  // 3️⃣ Compare sets
  const newProgramIds = programIds.filter(p_id => !existingIds.includes(p_id));
  const deletedProgramIds = existingIds.filter(p_id => !programIds.includes(p_id));

  // 4️⃣ Delete removed ones
  if (deletedProgramIds.length > 0) {
    await pool.query(
      'DELETE FROM program_list WHERE u_id = $1 AND p_id = ANY($2::int[]) AND pl_id = $3 AND session = $4',
      [u_id, deletedProgramIds, pl_id, session]
    );
    console.log(`Deleted programs for ${pl_id}, session=${session}:`, deletedProgramIds);
  }

  // 5️⃣ Insert new ones
  if (newProgramIds.length === 0) {
    console.log(`No new programs found for pl_id=${pl_id}, session=${session}`);
    return [];
  }

  const values = [];
  const placeholders = newProgramIds
    .map((p_id, index) => {
      const base = index * 4;
      values.push(u_id, p_id, pl_id, session);
      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
    })
    .join(', ');

  const insertQuery = `
    INSERT INTO program_list (u_id, p_id, pl_id, session)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log(`Inserted programs for ${pl_id}, session=${session}:`, newProgramIds);

  return result.rows;
};

// ð¥ Wrapper services with consistent naming
export const insertProgramsService = (u_id, programIds) =>
  insertProgramsByType(u_id, programIds, 'CCFUGP');

export const insertRegulatingProgramsService = (u_id, programIds) =>
  insertProgramsByType(u_id, programIds, 'REGULATING_COUNCILS');

export const insert3yearBachelorProgramsService = (u_id, programIds) =>
  insertProgramsByType(u_id, programIds, 'BACHELOR_3YEAR_PROGRAMS');

export const insertBvocProgramsService = (u_id, programIds) =>
  insertProgramsByType(u_id, programIds, 'BVOC_PROGRAMS');

export const insert4yearBachelorProgramService = (u_id, programIds) =>
  insertProgramsByType(u_id, programIds, 'BACHELOR_4YEAR_PROGRAMS');

export const insert4yearHonourProgramService = (u_id, programIds) =>
  insertProgramsByType(u_id, programIds, 'HONOUR_4YEAR_PROGRAMS');

export const insert4yearIntegratedDegreeProgramService = (u_id, programIds) =>
  insertProgramsByType(u_id, programIds, 'INTEGRATED_4YEAR_PROGRAMS');

export const insert5yearIntegratedDegreeProgramService = (u_id, programIds) =>
  insertProgramsByType(u_id, programIds, 'INTEGRATED_5YEAR_PROGRAMS');

export const insertUGProgramWithFlexibilityService = (u_id, programIds) =>
  insertProgramsByType(u_id, programIds, 'UG_PROGRAMS_WITH_FLEXIBILITY');





export const set_section_3Service = async(u_id, count_regulating,count_others) => {
    const session = getCurrentSession()
    const result = await pool.query('UPDATE ug_framework SET reg_council_count = $1 , others_count=$2 WHERE u_id = $3 AND session = $4 RETURNING *', [count_regulating, count_others, u_id,session]);
    return result.rows[0];
}

export const set_section_4Service = async(u_id, count_non_bvoc,count_bvoc) => {
    const session = getCurrentSession()
    const result = await pool.query('UPDATE ug_framework SET non_bvoc_3yr_count = $1 , bvoc_count = $2 WHERE u_id = $3 AND session = $4 RETURNING *', [count_non_bvoc, count_bvoc, u_id, session]);
    return result.rows[0];
}

export const set_section_5Service = async(u_id, count_bach, count_honor) => {
    const session = getCurrentSession()
    const result = await pool.query('UPDATE ug_framework SET bach_4yr_count = $1 , bach_4yr_hons_count = $2 WHERE u_id = $3 and session = $4 RETURNING *', [count_bach, count_honor, u_id, session]);
    return result.rows[0];
}

export const set_section_6Service = async(u_id, count_ITEP, ITEP_level, count_4year_integrated, count_PhD_after4years) => {
   const session = getCurrentSession()
    const result = await pool.query('UPDATE ug_framework SET itep_4yr_count = $1 , itep_4yr_level = $2 , apertitep_4yr_count = $3 , phd_after4yr = $4 WHERE u_id = $5 and session =$6 RETURNING *', [count_ITEP, ITEP_level, count_4year_integrated, count_PhD_after4years, u_id,session]);
    return result.rows[0];
}

export const set_section_7Service = async(u_id, count_5years_integrated) => {
  const session = getCurrentSession()
    const result = await pool.query('UPDATE ug_framework SET integrated_5yr_count = $1 WHERE u_id = $2 and session = $3 RETURNING *', [count_5years_integrated, u_id, session]);
    return result.rows[0];
}

export const set_section_8Service = async(u_id,count_ordinance,count_actual) => {
  const session = getCurrentSession()
    const result = await pool.query('UPDATE ug_framework SET ugprog_withhons_flex_count = $1 , ugprog_withhons_flex_count_actual = $2 WHERE u_id = $3 and session =$4 RETURNING *', [count_ordinance,count_actual,u_id,session]);
    return result.rows[0];
}