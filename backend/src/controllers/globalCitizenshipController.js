import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { setSection1Service, getCurrentSession, getSection1Service} from '../models/globalCitizenshipModel.js';
import pool from '../config/db.js'


const setSection1 = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    const { Courses_Global_Interdependence_Count,
        Courses_Global_Competencies_Count,
        Courses_Universal_Values_Count,
        Courses_active_citizenship_Count,
        Courses_Global_Interdependence_Percent,
        Courses_Global_Competencies_Percent,
        Courses_Universal_Values_Percent,
        Courses_active_citizenship_Percent
    } = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');

     const result = await setSection1Service(u_id, Courses_Global_Interdependence_Count, Courses_Global_Competencies_Count, Courses_Universal_Values_Count, Courses_active_citizenship_Count, Courses_Global_Interdependence_Percent, Courses_Global_Competencies_Percent, Courses_Universal_Values_Percent, Courses_active_citizenship_Percent);
    return res
        .status(200)
        .json(new ApiResponse(200, "Global Citizenship details updated successfully"));
});

export const getSection1 = asyncHandler(async (req, res) => {
  const { u_id } = req.user;
  if (!u_id) throw new ApiError(401, "User not authenticated");

  const data = await getSection1Service(u_id);

  if (!data) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No data found for this user"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Global Citizenship details fetched successfully"));
});

export const setGlobalInterdependenceList = asyncHandler(async (req, res) => {
  const { u_id, courses } = req.body;
  const session = getCurrentSession();

  console.log("Received courses:", courses);

  // ✅ 1️⃣ Delete all if no courses sent
  if (!courses || courses.length === 0) {
    await pool.query(
      `DELETE FROM Global_Interdep WHERE u_id = $1 AND session = $2`,
      [u_id, session]
    );
    console.log(`All courses deleted for u_id = ${u_id}`);
    return res
      .status(200)
      .json(new ApiResponse(200, [], "All courses deleted successfully"));
  }

  // ✅ 2️⃣ Fetch existing courses for this user and session
  const existing = await pool.query(
    `SELECT course FROM Global_Interdep WHERE u_id = $1 AND session = $2`,
    [u_id, session]
  );
  const existingCourses = existing.rows.map(row => row.course);

  // ✅ 3️⃣ Determine which courses to add or delete
  const newCourses = courses.filter(course => !existingCourses.includes(course));
  const deletedCourses = existingCourses.filter(course => !courses.includes(course));

  // ✅ 4️⃣ Delete removed courses
  if (deletedCourses.length > 0) {
    await pool.query(
      `DELETE FROM Global_Interdep 
       WHERE u_id = $1 AND session = $2 
       AND course = ANY($3::text[])`,
      [u_id, session, deletedCourses]
    );
    console.log("Deleted courses:", deletedCourses);
  }

  // ✅ 5️⃣ Skip insert if no new courses
  if (newCourses.length === 0) {
    console.log("No new courses to insert");
    return res
      .status(200)
      .json(new ApiResponse(200, [], "Courses updated successfully"));
  }

  // ✅ 6️⃣ Build dynamic insert placeholders
  const values = [];
  const placeholders = newCourses
    .map((course, index) => {
      const base = index * 3;
      values.push(u_id, session, course);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(", ");

  const insertQuery = `
    INSERT INTO Global_Interdep (u_id, session, course)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted courses:", newCourses);

  return res
    .status(200)
    .json(new ApiResponse(200, result.rows, "Courses updated successfully"));
});

export const setGlobalCompetenciesList = asyncHandler(async (req, res) => {
  const { u_id, courses } = req.body;
  const session = getCurrentSession();

  console.log("Received courses:", courses);

  // ✅ 1️⃣ Delete all if no courses sent
  if (!courses || courses.length === 0) {
    await pool.query(
      `DELETE FROM Global_Competency WHERE u_id = $1 AND session = $2`,
      [u_id, session]
    );
    console.log(`All courses deleted for u_id = ${u_id}`);
    return res
      .status(200)
      .json(new ApiResponse(200, [], "All courses deleted successfully"));
  }

  // ✅ 2️⃣ Fetch existing courses for this user and session
  const existing = await pool.query(
    `SELECT course FROM Global_Competency WHERE u_id = $1 AND session = $2`,
    [u_id, session]
  );
  const existingCourses = existing.rows.map(row => row.course);

  // ✅ 3️⃣ Determine which courses to add or delete
  const newCourses = courses.filter(course => !existingCourses.includes(course));
  const deletedCourses = existingCourses.filter(course => !courses.includes(course));

  // ✅ 4️⃣ Delete removed courses
  if (deletedCourses.length > 0) {
    await pool.query(
      `DELETE FROM Global_Competency 
       WHERE u_id = $1 AND session = $2 
       AND course = ANY($3::text[])`,
      [u_id, session, deletedCourses]
    );
    console.log("Deleted courses:", deletedCourses);
  }

  // ✅ 5️⃣ Skip insert if no new courses
  if (newCourses.length === 0) {
    console.log("No new courses to insert");
    return res
      .status(200)
      .json(new ApiResponse(200, [], "Courses updated successfully"));
  }

  // ✅ 6️⃣ Build dynamic insert placeholders
  const values = [];
  const placeholders = newCourses
    .map((course, index) => {
      const base = index * 3;
      values.push(u_id, session, course);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(", ");

  const insertQuery = `
    INSERT INTO Global_Competency (u_id, session, course)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted courses:", newCourses);

  return res
    .status(200)
    .json(new ApiResponse(200, result.rows, "Courses updated successfully"));
});

export const setUniversalValuesList = asyncHandler(async (req, res) => {
  const { u_id, courses } = req.body;
  const session = getCurrentSession();

  console.log("Received courses:", courses);

  // ✅ 1️⃣ Delete all if no courses sent
  if (!courses || courses.length === 0) {
    await pool.query(
      `DELETE FROM Universal WHERE u_id = $1 AND session = $2`,
      [u_id, session]
    );
    console.log(`All courses deleted for u_id = ${u_id}`);
    return res
      .status(200)
      .json(new ApiResponse(200, [], "All courses deleted successfully"));
  }

  // ✅ 2️⃣ Fetch existing courses for this user and session
  const existing = await pool.query(
    `SELECT course FROM Universal WHERE u_id = $1 AND session = $2`,
    [u_id, session]
  );
  const existingCourses = existing.rows.map(row => row.course);

  // ✅ 3️⃣ Determine which courses to add or delete
  const newCourses = courses.filter(course => !existingCourses.includes(course));
  const deletedCourses = existingCourses.filter(course => !courses.includes(course));

  // ✅ 4️⃣ Delete removed courses
  if (deletedCourses.length > 0) {
    await pool.query(
      `DELETE FROM Universal 
       WHERE u_id = $1 AND session = $2 
       AND course = ANY($3::text[])`,
      [u_id, session, deletedCourses]
    );
    console.log("Deleted courses:", deletedCourses);
  }

  // ✅ 5️⃣ Skip insert if no new courses
  if (newCourses.length === 0) {
    console.log("No new courses to insert");
    return res
      .status(200)
      .json(new ApiResponse(200, [], "Courses updated successfully"));
  }

  // ✅ 6️⃣ Build dynamic insert placeholders
  const values = [];
  const placeholders = newCourses
    .map((course, index) => {
      const base = index * 3;
      values.push(u_id, session, course);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(", ");

  const insertQuery = `
    INSERT INTO Universal (u_id, session, course)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted courses:", newCourses);

  return res
    .status(200)
    .json(new ApiResponse(200, result.rows, "Courses updated successfully"));
});

export const setActiveCitizenshipList = asyncHandler(async (req, res) => {
  const { u_id, courses } = req.body;
  const session = getCurrentSession();

  console.log("Received courses:", courses);

  // ✅ 1️⃣ Delete all if no courses sent
  if (!courses || courses.length === 0) {
    await pool.query(
      `DELETE FROM Active WHERE u_id = $1 AND session = $2`,
      [u_id, session]
    );
    console.log(`All courses deleted for u_id = ${u_id}`);
    return res
      .status(200)
      .json(new ApiResponse(200, [], "All courses deleted successfully"));
  }

  // ✅ 2️⃣ Fetch existing courses for this user and session
  const existing = await pool.query(
    `SELECT course FROM Active WHERE u_id = $1 AND session = $2`,
    [u_id, session]
  );
  const existingCourses = existing.rows.map(row => row.course);

  // ✅ 3️⃣ Determine which courses to add or delete
  const newCourses = courses.filter(course => !existingCourses.includes(course));
  const deletedCourses = existingCourses.filter(course => !courses.includes(course));

  // ✅ 4️⃣ Delete removed courses
  if (deletedCourses.length > 0) {
    await pool.query(
      `DELETE FROM Active 
       WHERE u_id = $1 AND session = $2 
       AND course = ANY($3::text[])`,
      [u_id, session, deletedCourses]
    );
    console.log("Deleted courses:", deletedCourses);
  }

  // ✅ 5️⃣ Skip insert if no new courses
  if (newCourses.length === 0) {
    console.log("No new courses to insert");
    return res
      .status(200)
      .json(new ApiResponse(200, [], "Courses updated successfully"));
  }

  // ✅ 6️⃣ Build dynamic insert placeholders
  const values = [];
  const placeholders = newCourses
    .map((course, index) => {
      const base = index * 3;
      values.push(u_id, session, course);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(", ");

  const insertQuery = `
    INSERT INTO Active (u_id, session, course)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, values);
  console.log("Inserted courses:", newCourses);

  return res
    .status(200)
    .json(new ApiResponse(200, result.rows, "Courses updated successfully"));
});

export const getList = async (tableName, u_id, label) => {
  const session = getCurrentSession();

  const result = await pool.query(
    `SELECT course FROM ${tableName} WHERE u_id = $1 AND session = $2 ORDER BY global_comp_id`,
    [u_id, session]
  );

  const courses = result.rows.map(row => row.course);
  return new ApiResponse(200, courses, `${label} courses fetched successfully`);
};


export const getGlobalInterdependenceList = asyncHandler(async (req, res) => {
  const { u_id } = req.params;
  const response = await getList("Global_Interdep", u_id, "Global Interdependence");
  res.status(200).json(response);
});

export const getGlobalCompetenciesList = asyncHandler(async (req, res) => {
  const { u_id } = req.params;
  const response = await getList("Global_Competency", u_id, "Global Competencies");
  res.status(200).json(response);
});

export const getUniversalValuesList = asyncHandler(async (req, res) => {
  const { u_id } = req.params;
  const response = await getList("Universal", u_id, "Universal Values");
  res.status(200).json(response);
});

export const getActiveCitizenshipList = asyncHandler(async (req, res) => {
  const { u_id } = req.params;
  const response = await getList("Active", u_id, "Active Citizenship");
  res.status(200).json(response);
});


export { setSection1 };