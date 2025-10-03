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

export const insertProgramsService = async (u_id, programIds) => {
  const pl_id = 'CCFUGP';
console.log("Received programIds:", programIds, "Type:", typeof programIds);
  // ✅ 1️⃣ Delete all if no program IDs sent
  if (!programIds || programIds.length === 0) {
    const result = await pool.query('DELETE FROM program_list WHERE u_id = $1 and pl_id = $2', [u_id,pl_id]);
    console.log(`All programs deleted for u_id = ${u_id}`);
    return result.rows;
  }

  // ✅ 2️⃣ Get existing program IDs
  const existing = await pool.query(
    `SELECT p_id FROM program_list WHERE u_id = $1 and pl_id = $2`,
    [u_id,pl_id]
  );
  const existingIds = existing.rows.map(row => row.p_id);

  // ✅ 3️⃣ Compare and find which to insert/delete
  const newProgramIds = programIds.filter(p_id => !existingIds.includes(p_id));
  const deletedProgramIds = existingIds.filter(p_id => !programIds.includes(p_id));

  // ✅ 4️⃣ Delete removed ones
  if (deletedProgramIds.length > 0) {
    const deleteQuery = `
      DELETE FROM program_list
      WHERE u_id = $1 AND p_id = ANY($2::int[]) AND pl_id = $3;
    `;
    await pool.query(deleteQuery, [u_id, deletedProgramIds, pl_id]);
    console.log("Deleted programs:", deletedProgramIds);
  }

  // ✅ 5️⃣ Skip insert if no new programs
  if (newProgramIds.length === 0) {
    console.log('No new programs found')
    return []
  }

  // ✅ 6️⃣ Build dynamic placeholders safely
  const values = [];
  const placeholders = newProgramIds
    .map((p_id, index) => {
      const base = index * 3;
      values.push(u_id, p_id, pl_id);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(', ');

  const insertQuery = `
    INSERT INTO program_list (u_id, p_id, pl_id)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted programs:", newProgramIds);

  return result.rows;
};

export const insertRegulatingProgramsService = async (u_id, programIds) => {
  const pl_id = 'REGULATING_COUNCILS';
console.log("Received programIds:", programIds, "Type:", typeof programIds);
  // ✅ 1️⃣ Delete all if no program IDs sent
  if (!programIds || programIds.length === 0) {
    const result = await pool.query('DELETE FROM program_list WHERE u_id = $1 and pl_id = $2', [u_id,pl_id]);
    console.log(`All programs deleted for u_id = ${u_id}`);
    return result.rows;
  }

  // ✅ 2️⃣ Get existing program IDs
  const existing = await pool.query(
    `SELECT p_id FROM program_list WHERE u_id = $1 and pl_id = $2`,
    [u_id,pl_id]
  );
  const existingIds = existing.rows.map(row => row.p_id);

  // ✅ 3️⃣ Compare and find which to insert/delete
  const newProgramIds = programIds.filter(p_id => !existingIds.includes(p_id));
  const deletedProgramIds = existingIds.filter(p_id => !programIds.includes(p_id));

  // ✅ 4️⃣ Delete removed ones
  if (deletedProgramIds.length > 0) {
    const deleteQuery = `
      DELETE FROM program_list
      WHERE u_id = $1 AND p_id = ANY($2::int[]) AND pl_id = $3;
    `;
    await pool.query(deleteQuery, [u_id, deletedProgramIds, pl_id]);
    console.log("Deleted programs:", deletedProgramIds);
  }

  // ✅ 5️⃣ Skip insert if no new programs
  if (newProgramIds.length === 0) {
    console.log('No new programs found')
    return []
  }

  // ✅ 6️⃣ Build dynamic placeholders safely
  const values = [];
  const placeholders = newProgramIds
    .map((p_id, index) => {
      const base = index * 3;
      values.push(u_id, p_id, pl_id);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(', ');

  const insertQuery = `
    INSERT INTO program_list (u_id, p_id, pl_id)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted programs:", newProgramIds);

  return result.rows;
};

export const insert3yearBachelorProgramsService = async (u_id, programIds) => {
  const pl_id = 'BACHELOR_3YEAR_PROGRAMS';
console.log("Received programIds:", programIds, "Type:", typeof programIds);
  // ✅ 1️⃣ Delete all if no program IDs sent
  if (!programIds || programIds.length === 0) {
    const result = await pool.query('DELETE FROM program_list WHERE u_id = $1 and pl_id = $2', [u_id,pl_id]);
    console.log(`All programs deleted for u_id = ${u_id}`);
    return result.rows;
  }

  // ✅ 2️⃣ Get existing program IDs
  const existing = await pool.query(
    `SELECT p_id FROM program_list WHERE u_id = $1 and pl_id = $2`,
    [u_id,pl_id]
  );
  const existingIds = existing.rows.map(row => row.p_id);

  // ✅ 3️⃣ Compare and find which to insert/delete
  const newProgramIds = programIds.filter(p_id => !existingIds.includes(p_id));
  const deletedProgramIds = existingIds.filter(p_id => !programIds.includes(p_id));

  // ✅ 4️⃣ Delete removed ones
  if (deletedProgramIds.length > 0) {
    const deleteQuery = `
      DELETE FROM program_list
      WHERE u_id = $1 AND p_id = ANY($2::int[]) AND pl_id = $3;
    `;
    await pool.query(deleteQuery, [u_id, deletedProgramIds, pl_id]);
    console.log("Deleted programs:", deletedProgramIds);
  }

  // ✅ 5️⃣ Skip insert if no new programs
  if (newProgramIds.length === 0) {
    console.log('No new programs found')
    return []
  }

  // ✅ 6️⃣ Build dynamic placeholders safely
  const values = [];
  const placeholders = newProgramIds
    .map((p_id, index) => {
      const base = index * 3;
      values.push(u_id, p_id, pl_id);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(', ');

  const insertQuery = `
    INSERT INTO program_list (u_id, p_id, pl_id)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted programs:", newProgramIds);

  return result.rows;
};

export const insertBvocProgramsService = async (u_id, programIds) => {
  const pl_id = 'BVOC_PROGRAMS';
console.log("Received programIds:", programIds, "Type:", typeof programIds);
  // ✅ 1️⃣ Delete all if no program IDs sent
  if (!programIds || programIds.length === 0) {
    const result = await pool.query('DELETE FROM program_list WHERE u_id = $1 and pl_id = $2', [u_id,pl_id]);
    console.log(`All programs deleted for u_id = ${u_id}`);
    return result.rows;
  }

  // ✅ 2️⃣ Get existing program IDs
  const existing = await pool.query(
    `SELECT p_id FROM program_list WHERE u_id = $1 and pl_id = $2`,
    [u_id,pl_id]
  );
  const existingIds = existing.rows.map(row => row.p_id);

  // ✅ 3️⃣ Compare and find which to insert/delete
  const newProgramIds = programIds.filter(p_id => !existingIds.includes(p_id));
  const deletedProgramIds = existingIds.filter(p_id => !programIds.includes(p_id));

  // ✅ 4️⃣ Delete removed ones
  if (deletedProgramIds.length > 0) {
    const deleteQuery = `
      DELETE FROM program_list
      WHERE u_id = $1 AND p_id = ANY($2::int[]) AND pl_id = $3;
    `;
    await pool.query(deleteQuery, [u_id, deletedProgramIds, pl_id]);
    console.log("Deleted programs:", deletedProgramIds);
  }

  // ✅ 5️⃣ Skip insert if no new programs
  if (newProgramIds.length === 0) {
    console.log('No new programs found')
    return []
  }

  // ✅ 6️⃣ Build dynamic placeholders safely
  const values = [];
  const placeholders = newProgramIds
    .map((p_id, index) => {
      const base = index * 3;
      values.push(u_id, p_id, pl_id);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(', ');

  const insertQuery = `
    INSERT INTO program_list (u_id, p_id, pl_id)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted programs:", newProgramIds);

  return result.rows;
};

export const insert4yearBachelorProgramService = async (u_id, programIds) => {
  const pl_id = 'BACHELOR_4YEAR_PROGRAMS';
console.log("Received programIds:", programIds, "Type:", typeof programIds);
  // ✅ 1️⃣ Delete all if no program IDs sent
  if (!programIds || programIds.length === 0) {
    const result = await pool.query('DELETE FROM program_list WHERE u_id = $1 and pl_id = $2', [u_id,pl_id]);
    console.log(`All programs deleted for u_id = ${u_id}`);
    return result.rows;
  }

  // ✅ 2️⃣ Get existing program IDs
  const existing = await pool.query(
    `SELECT p_id FROM program_list WHERE u_id = $1 and pl_id = $2`,
    [u_id,pl_id]
  );
  const existingIds = existing.rows.map(row => row.p_id);

  // ✅ 3️⃣ Compare and find which to insert/delete
  const newProgramIds = programIds.filter(p_id => !existingIds.includes(p_id));
  const deletedProgramIds = existingIds.filter(p_id => !programIds.includes(p_id));

  // ✅ 4️⃣ Delete removed ones
  if (deletedProgramIds.length > 0) {
    const deleteQuery = `
      DELETE FROM program_list
      WHERE u_id = $1 AND p_id = ANY($2::int[]) AND pl_id = $3;
    `;
    await pool.query(deleteQuery, [u_id, deletedProgramIds, pl_id]);
    console.log("Deleted programs:", deletedProgramIds);
  }

  // ✅ 5️⃣ Skip insert if no new programs
  if (newProgramIds.length === 0) {
    console.log('No new programs found')
    return []
  }

  // ✅ 6️⃣ Build dynamic placeholders safely
  const values = [];
  const placeholders = newProgramIds
    .map((p_id, index) => {
      const base = index * 3;
      values.push(u_id, p_id, pl_id);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(', ');

  const insertQuery = `
    INSERT INTO program_list (u_id, p_id, pl_id)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted programs:", newProgramIds);

  return result.rows;
}

export const insert4yearHonourProgramService = async (u_id, programIds) => {
  const pl_id = 'HONOUR_4YEAR_PROGRAMS';
console.log("Received programIds:", programIds, "Type:", typeof programIds);
  // ✅ 1️⃣ Delete all if no program IDs sent
  if (!programIds || programIds.length === 0) {
    const result = await pool.query('DELETE FROM program_list WHERE u_id = $1 and pl_id = $2', [u_id,pl_id]);
    console.log(`All programs deleted for u_id = ${u_id}`);
    return result.rows;
  }

  // ✅ 2️⃣ Get existing program IDs
  const existing = await pool.query(
    `SELECT p_id FROM program_list WHERE u_id = $1 and pl_id = $2`,
    [u_id,pl_id]
  );
  const existingIds = existing.rows.map(row => row.p_id);

  // ✅ 3️⃣ Compare and find which to insert/delete
  const newProgramIds = programIds.filter(p_id => !existingIds.includes(p_id));
  const deletedProgramIds = existingIds.filter(p_id => !programIds.includes(p_id));

  // ✅ 4️⃣ Delete removed ones
  if (deletedProgramIds.length > 0) {
    const deleteQuery = `
      DELETE FROM program_list
      WHERE u_id = $1 AND p_id = ANY($2::int[]) AND pl_id = $3;
    `;
    await pool.query(deleteQuery, [u_id, deletedProgramIds, pl_id]);
    console.log("Deleted programs:", deletedProgramIds);
  }

  // ✅ 5️⃣ Skip insert if no new programs
  if (newProgramIds.length === 0) {
    console.log('No new programs found')
    return []
  }

  // ✅ 6️⃣ Build dynamic placeholders safely
  const values = [];
  const placeholders = newProgramIds
    .map((p_id, index) => {
      const base = index * 3;
      values.push(u_id, p_id, pl_id);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(', ');

  const insertQuery = `
    INSERT INTO program_list (u_id, p_id, pl_id)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted programs:", newProgramIds);

  return result.rows;
}

export const insert4yearIntegratedDegreeProgramService = async (u_id, programIds) => {
  const pl_id = 'INTEGRATED_4YEAR_PROGRAMS';
console.log("Received programIds:", programIds, "Type:", typeof programIds);
  // ✅ 1️⃣ Delete all if no program IDs sent
  if (!programIds || programIds.length === 0) {
    const result = await pool.query('DELETE FROM program_list WHERE u_id = $1 and pl_id = $2', [u_id,pl_id]);
    console.log(`All programs deleted for u_id = ${u_id}`);
    return result.rows;
  }

  // ✅ 2️⃣ Get existing program IDs
  const existing = await pool.query(
    `SELECT p_id FROM program_list WHERE u_id = $1 and pl_id = $2`,
    [u_id,pl_id]
  );
  const existingIds = existing.rows.map(row => row.p_id);

  // ✅ 3️⃣ Compare and find which to insert/delete
  const newProgramIds = programIds.filter(p_id => !existingIds.includes(p_id));
  const deletedProgramIds = existingIds.filter(p_id => !programIds.includes(p_id));

  // ✅ 4️⃣ Delete removed ones
  if (deletedProgramIds.length > 0) {
    const deleteQuery = `
      DELETE FROM program_list
      WHERE u_id = $1 AND p_id = ANY($2::int[]) AND pl_id = $3;
    `;
    await pool.query(deleteQuery, [u_id, deletedProgramIds, pl_id]);
    console.log("Deleted programs:", deletedProgramIds);
  }

  // ✅ 5️⃣ Skip insert if no new programs
  if (newProgramIds.length === 0) {
    console.log('No new programs found')
    return []
  }

  // ✅ 6️⃣ Build dynamic placeholders safely
  const values = [];
  const placeholders = newProgramIds
    .map((p_id, index) => {
      const base = index * 3;
      values.push(u_id, p_id, pl_id);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(', ');

  const insertQuery = `
    INSERT INTO program_list (u_id, p_id, pl_id)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted programs:", newProgramIds);

  return result.rows;
}

export const insert5yearIntegratedDegreeProgramService = async (u_id, programIds) => {
  const pl_id = 'INTEGRATED_5YEAR_PROGRAMS';
console.log("Received programIds:", programIds, "Type:", typeof programIds);
  // ✅ 1️⃣ Delete all if no program IDs sent
  if (!programIds || programIds.length === 0) {
    const result = await pool.query('DELETE FROM program_list WHERE u_id = $1 and pl_id = $2', [u_id,pl_id]);
    console.log(`All programs deleted for u_id = ${u_id}`);
    return result.rows;
  }

  // ✅ 2️⃣ Get existing program IDs
  const existing = await pool.query(
    `SELECT p_id FROM program_list WHERE u_id = $1 and pl_id = $2`,
    [u_id,pl_id]
  );
  const existingIds = existing.rows.map(row => row.p_id);

  // ✅ 3️⃣ Compare and find which to insert/delete
  const newProgramIds = programIds.filter(p_id => !existingIds.includes(p_id));
  const deletedProgramIds = existingIds.filter(p_id => !programIds.includes(p_id));

  // ✅ 4️⃣ Delete removed ones
  if (deletedProgramIds.length > 0) {
    const deleteQuery = `
      DELETE FROM program_list
      WHERE u_id = $1 AND p_id = ANY($2::int[]) AND pl_id = $3;
    `;
    await pool.query(deleteQuery, [u_id, deletedProgramIds, pl_id]);
    console.log("Deleted programs:", deletedProgramIds);
  }

  // ✅ 5️⃣ Skip insert if no new programs
  if (newProgramIds.length === 0) {
    console.log('No new programs found')
    return []
  }

  // ✅ 6️⃣ Build dynamic placeholders safely
  const values = [];
  const placeholders = newProgramIds
    .map((p_id, index) => {
      const base = index * 3;
      values.push(u_id, p_id, pl_id);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(', ');

  const insertQuery = `
    INSERT INTO program_list (u_id, p_id, pl_id)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted programs:", newProgramIds);

  return result.rows;
}

export const insertUGProgramWithFlexibilityService = async (u_id, programIds) => {
  const pl_id = 'UG_PROGRAMS_WITH_FLEXIBILITY';
console.log("Received programIds:", programIds, "Type:", typeof programIds);
  // ✅ 1️⃣ Delete all if no program IDs sent
  if (!programIds || programIds.length === 0) {
    const result = await pool.query('DELETE FROM program_list WHERE u_id = $1 and pl_id = $2', [u_id,pl_id]);
    console.log(`All programs deleted for u_id = ${u_id}`);
    return result.rows;
  }

  // ✅ 2️⃣ Get existing program IDs
  const existing = await pool.query(
    `SELECT p_id FROM program_list WHERE u_id = $1 and pl_id = $2`,
    [u_id,pl_id]
  );
  const existingIds = existing.rows.map(row => row.p_id);

  // ✅ 3️⃣ Compare and find which to insert/delete
  const newProgramIds = programIds.filter(p_id => !existingIds.includes(p_id));
  const deletedProgramIds = existingIds.filter(p_id => !programIds.includes(p_id));

  // ✅ 4️⃣ Delete removed ones
  if (deletedProgramIds.length > 0) {
    const deleteQuery = `
      DELETE FROM program_list
      WHERE u_id = $1 AND p_id = ANY($2::int[]) AND pl_id = $3;
    `;
    await pool.query(deleteQuery, [u_id, deletedProgramIds, pl_id]);
    console.log("Deleted programs:", deletedProgramIds);
  }

  // ✅ 5️⃣ Skip insert if no new programs
  if (newProgramIds.length === 0) {
    console.log('No new programs found')
    return []
  }

  // ✅ 6️⃣ Build dynamic placeholders safely
  const values = [];
  const placeholders = newProgramIds
    .map((p_id, index) => {
      const base = index * 3;
      values.push(u_id, p_id, pl_id);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(', ');

  const insertQuery = `
    INSERT INTO program_list (u_id, p_id, pl_id)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted programs:", newProgramIds);

  return result.rows;
}




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