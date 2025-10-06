import XLSX from "xlsx";
import fs from "fs/promises";
import asyncHandler from "./asyncHandler.js";
import ApiError from "./ApiError.js";
import ApiResponse from "./ApiResponse.js";
import pool from "../config/db.js";
import getCurrentSession from "./generateSession.js";

const importData = asyncHandler(async (req, res) => {
  const { u_id } = req.user;
  const session = getCurrentSession();


  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const excelLocalePath = req.file.path; 
  const workbook = XLSX.readFile(excelLocalePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (rows.length === 0) {
    throw new ApiError(400, "Excel file is empty");
  }

  for (const row of rows) {
    await pool.query(
      "INSERT INTO incubation_recognition (u_id, session, agency_name, agency_type) VALUES ($1, $2, $3, $4)",
      [u_id, session, row.agency_name, row.agency_type]
    );
  }

  
  await fs.unlink(excelLocalePath).catch(err =>
    console.warn("⚠️ Could not delete uploaded file:", err.message)
  );

  return res.status(200).json(
    new ApiResponse(200, "Data imported successfully", { count: rows.length })
  );
});

export { importData };
