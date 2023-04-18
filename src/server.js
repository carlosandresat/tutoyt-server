import express from 'express'
import cors from 'cors'
import {pool} from './db.js'
import {PORT} from './config.js'

import indexRoutes from './routes/index.routes.js'

const app = express()

app.use(express.json())
app.use(cors())

app.use(indexRoutes)

// routes --------------------

app.get('/asignaturas', async (req, res)=>{

    const [rows] = await pool.query('SELECT classes.id, classes.name, school.code FROM classes INNER JOIN school ON classes.id_school = school.id')
    res.json(rows)
})
app.get('/tutores', async (req, res)=>{

    const [rows] = await pool.query('SELECT t2.id_tutor AS id, t1.name, TRUNCATE(t2.rating, 1) AS rating, t2.nreviews FROM user t1 INNER JOIN (SELECT id_tutor, AVG(stars) AS rating, COUNT(stars) as nreviews FROM session GROUP BY id_tutor) t2 WHERE t1.id = t2.id_tutor')
    res.json(rows)    
})

// Server running -------------------
app.listen(PORT)