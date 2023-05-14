import { Router } from "express";
import { pool } from "../db.js";
import {  
    requestSession,
    getSessionsByTutor,
    getSessionsByStudent
} from "../controllers/session.controllers.js";
import {  
    getTutorsByClass,
    getClassesByTutor
} from "../controllers/tutor-classes.controller.js";

import { 
    createUser,
    checkUser
} from "../controllers/register.controllers.js";

const router = Router();

router.get('/ping', async (req, res)=>{
    const [rows] = await pool.query('SELECT "Hello world" AS result');
    res.json(rows[0]);
}) 

//Session----------
router.post('/session', requestSession)
router.get('/session/:user', getSessionsByStudent)

//Tutor------------
router.get('/tutor/:tutorId', getTutorsByClass)

//Classes----------
router.get('/classes/:classId', getClassesByTutor)

//Register-------------
router.post('/newUser', createUser)
router.get('/checkUser/:user', checkUser)

export default router;