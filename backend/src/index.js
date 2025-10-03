import express from 'express'
import dotenv from 'dotenv'
import cors from "cors"
import pool from './config/db.js'
import cookieParser from 'cookie-parser'

import userRouter from './routes/userRoutes.js'
import uniRouter from './routes/universityFormRoute.js'
import programDataRouter from './routes/programDataRoute.js'
import facultyRouter from './routes/facultyRoute.js'
import departmentRouter from './routes/deptRoute.js'
import programRouter from './routes/programRoute.js'
import ugFormRouter from './routes/ugFormRoute.js'

dotenv.config({
  path: './env'
})

const app = express();
const port = process.env.PORT || 8000

console.log(process.env.PORT);


//Middlewares

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.urlencoded({extended: true, limit: '20kb'}));
app.use(express.static('public'));

//Routes
app.use('/api', userRouter)
app.use('/api/uni-data', uniRouter)
app.use('/api/program-data', programDataRouter)
app.use('/api/faculty', facultyRouter)
app.use('/api/department', departmentRouter)
app.use('/api/program', programRouter)
app.use('/api/ugform', ugFormRouter)

app.get('/', async(req,res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
})