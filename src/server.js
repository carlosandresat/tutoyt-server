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
            "http://192.168.20.100:3000",
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

    const [rows] = await pool.query('SELECT t2.id_tutor AS id, t1.name, TRUNCATE(t2.rating, 1) AS rating, t2.nreviews FROM user t1 INNER JOIN (SELECT id_tutor, AVG(stars) AS rating, COUNT(stars) as nreviews FROM session GROUP BY id_tutor) t2 WHERE t1.id = t2.id_tutor')
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
                next()
            }
        })
    }
}

app.get('/', verifyUser, (req, res) => {
    return res.json({Status: "Success", user: req.user})
})

app.post('/login', async (req, res)=>{
    const { user, password } = req.body;
    const [result] = await pool.query(
        'SELECT * FROM user WHERE user = ? AND password = ?',
        [user, password]
    )
    if(result.length > 0) {
        const user = result[0].user
        const token = jwt.sign({user}, "tutoyt-key0963963170", {expiresIn: '1d'})
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