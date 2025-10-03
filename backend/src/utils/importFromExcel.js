import XLSX from "xlsx";
import fs from "fs/promises";
import asyncHandler from "./asyncHandler.js";
import ApiError from "./ApiError.js";
import ApiResponse from "./ApiResponse.js";
import pool from "../config/db.js";

const importData = asyncHandler(async (req, res) => {
  if (!req.files || !req.files['file'] || req.files['file'].length === 0) {
    throw new ApiError(400, 'No file uploaded');
  }

  const excelLocalePath = req.files['file'][0].path;
  const workbook = XLSX.readFile(excelLocalePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (rows.length === 0) {
    throw new ApiError(400, "Excel file is empty");
  }

  
  for (const row of rows) {
    await pool.query(
      "INSERT INTO master_data (course_name, faculty) VALUES ($1, $2)",
      [row.course_name, row.faculty]
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
