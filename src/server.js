import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import {pool} from './db.js'
import {PORT, JWT_SECRET} from './config.js'

import indexRoutes from './routes/index.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        origin: [
            "http://localhost:3000"
    ],
        credentials: true
    }
))

app.use(indexRoutes)

// routes --------------------

app.get('/asignaturas', async (req, res)=>{

    const [rows] = await pool.query('SELECT classes.id, classes.name, school.code FROM classes INNER JOIN school ON classes.id_school = school.id')
    res.json(rows)
})
app.get('/tutores', async (req, res)=>{

    const [rows] = await pool.query('SELECT   u.id, u.name,    u.pic_url,    TRUNCATE(AVG(s.rate_tutor), 1) AS rating, COUNT(s.rate_tutor) AS nreviews  FROM    user u    INNER JOIN session s ON u.id = s.id_tutor  GROUP BY   u.id, u.name,    u.pic_url  HAVING    COUNT(s.rate_tutor) >= 1  ORDER BY nreviews DESC LIMIT 10')
    res.json(rows)    
})

app.get('/all', async (req, res)=>{

    const [rows] = await pool.query('Select * from user')
    res.json(rows)    
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token
    if(!token) {
        return res.json({Message: "No estás conectado. Inicia sesión."})
    } else {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if(err){
                return res.json({Message: "Authentication Error."})
            } else {
                req.id = decoded.id
                req.user = decoded.user
                req.status = decoded.status
                next()
            }
        })
    }
}

app.get('/', verifyUser, (req, res) => {
    return res.json({Status: "Success", id: req.id, user: req.user, status: req.status})
})

app.post('/login', async (req, res)=>{
    const { user, password } = req.body;
    const [result] = await pool.query(
        'SELECT * FROM user WHERE user = ? AND password = ?',
        [user, password]
    ).catch(err => {
        console.error('Error executing query:', err);
        return [];
    })
    if(result.length > 0) {
        const user = result[0].user
        const id = result[0].id
        const status = result[0].status
        const token = jwt.sign({id, user, status}, JWT_SECRET, {expiresIn: '8h'})
        res.cookie('token', token, {
            sameSite: 'lax'
        })

        const dateNow  = new Date()

        console.log(`USER ${user} LOGGED AT ${dateNow.toLocaleString()} `)
        return res.json({Status: "Success"})
    }
    else{
        return res.json({message: "Usuario o contraseña no válidos"})
    }
})

app.get('/logout', (req, res)=>{
    res.clearCookie('token')
    return res.json({Status: "Success"})
})


// Server running -------------------
app.listen(PORT)