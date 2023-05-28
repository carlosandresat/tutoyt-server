import { Router } from "express";
import { pool } from "../db.js";
import {  
    requestSession,
    getSessionsByTutor,
    getSessionsByStudent,
    acceptSession,
    cancelSession,
    updateDate,
    updatePlace,
    updateTopic,
    updateDatePlace,
    updateDateTopic,
    updatePlaceTopic,
    updateAll
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
router.get('/session/tutor/:user', getSessionsByTutor)
router.put('/session/accept/:sessionId', acceptSession)
router.put('/session/cancel/:sessionId', cancelSession)
router.put('/session/update/date/:sessionId', updateDate)
router.put('/session/update/place/:sessionId', updatePlace)
router.put('/session/update/topic/:sessionId', updateTopic)
router.put('/session/update/date-place/:sessionId', updateDatePlace)
router.put('/session/update/date-topic/:sessionId', updateDateTopic)
router.put('/session/update/place-topic/:sessionId', updatePlaceTopic)
router.put('/session/update/all/:sessionId', updateAll)


//Tutor------------
router.get('/tutor/:tutorId', getTutorsByClass)

//Classes----------
router.get('/classes/:classId', getClassesByTutor)

//Register-------------
router.post('/newUser', createUser)
router.get('/checkUser/:user', checkUser)

export default router;