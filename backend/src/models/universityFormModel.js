import pool from "../config/db.js";


export const uploadUniNameService = async(universityName, id) => {
  const existingResultQuery = await pool.query('SELECT u_name FROM university_data where u_id = $1', [id])
  const existingResult = existingResultQuery.rows[0]
  if(existingResult){
    const result = await pool.query('UPDATE university_data SET u_name = $1 WHERE u_id = $2 RETURNING *', [universityName,id])
    return result.rows[0]
  } else {
    const result = await pool.query('INSERT into university_data (u_name,u_id) VALUES ($1,$2) RETURNING *', [universityName,id])
    return result.rows[0]
  }
}

export const uploadAddressService = async(id,street,city,state,pincode) => {
  const fullAddress = `${street}, ${city}, ${state}, ${pincode}`
  const result = await pool.query('UPDATE university_data SET u_address = $1 WHERE u_id = $2 RETURNING *', [fullAddress,id])
  return result.rows[0];
}

export const uploadContactService = async(id,phone,website) => {
  const result = await pool.query('UPDATE university_data SET u_phone = $1, u_website_url = $2 WHERE u_id = $3 RETURNING *', [phone,website,id])
  return result.rows[0]
}

export const uploadVcInfoService = async(id,name,mobile,email) => {
  const result = await pool.query('UPDATE university_data SET u_vc_name = $1, vc_mobile = $2, vc_mail = $3 WHERE u_id = $4  RETURNING *', [name,mobile,email,id])
  return result.rows[0]
}

export const uploadRegistrarInfoService = async(id,name,mobile,email) => {
  const result = await pool.query('UPDATE university_data SET u_reg_name = $1, reg_mobile = $2, reg_email = $3 WHERE u_id = $4  RETURNING *', [name,mobile,email,id])
  return result.rows[0]
}

export const getUniByIdService = async(id) => {
  const result = await pool.query('SELECT * FROM university_data WHERE u_id = $1', [id])
  return result.rows[0]
}