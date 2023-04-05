import { Router } from "express";
import { pool } from "../db.js";
import {  
    requestSession,
    getSessionsByTutor
} from "../controllers/session.controllers.js";
import {  
    getTutorsByClass,
    getClassesByTutor
} from "../controllers/tutor-classes.controller.js";

const router = Router();

router.get('/ping', async (req, res)=>{
    const [rows] = await pool.query('SELECT "Hello world" AS result');
    res.json(rows[0]);
}) 

//Session----------
router.post('/session', requestSession)

//Tutor-classes
router.get('/tutor/:tutorId', getTutorsByClass)

export default router;