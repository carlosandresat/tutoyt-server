import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import {pool} from './db.js'
import {PORT} from './config.js'

import indexRoutes from './routes/index.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        origin: [
            "http://localhost:3000",
            "http://192.168.20.108:3000",
            "https://tutoyt-react-production.up.railway.app"
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

    const [rows] = await pool.query('SELECT   u.id, u.name,    u.pic_url,    TRUNCATE(AVG(s.stars), 1) AS rating, COUNT(u.name) AS nreviews  FROM    user u    INNER JOIN session s ON u.id = s.id_tutor  GROUP BY   u.id, u.name,    u.pic_url  HAVING    COUNT(s.id) >= 1  ORDER BY    rating DESC')
    res.json(rows)    
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token
    if(!token) {
        return res.json({Message: "No estás conectado. Inicia sesión."})
    } else {
        jwt.verify(token, "tutoyt-key0963963170", (err, decoded) => {
            if(err){
                return res.json({Message: "Authentication Error."})
            } else {
                req.user = decoded.user
                req.type = decoded.type
                next()
            }
        })
    }
}

app.get('/', verifyUser, (req, res) => {
    return res.json({Status: "Success", user: req.user, type: req.type})
})

app.post('/login', async (req, res)=>{
    const { user, password } = req.body;
    const [result] = await pool.query(
        'SELECT * FROM user WHERE user = ? AND password = ?',
        [user, password]
    )
    if(result.length > 0) {
        const user = result[0].user
        const token = jwt.sign({user, type: result[0].status}, "tutoyt-key0963963170", {expiresIn: '1d'})
        res.cookie('token', token, {
            sameSite: 'lax'
        })
        console.log(`User ${user} logged`)
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