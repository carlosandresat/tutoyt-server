import { Router } from "express";
import { pool } from "../db.js";
import {  
    requestSession,
    getSessionsByTutor,
    getSessionsByStudent,
    getTutorSessionsByDate,
    acceptSession,
    cancelSession,
    updateDate,
    updatePlace,
    updateTopic,
    updateDatePlace,
    updateDateTopic,
    updatePlaceTopic,
    updateAll,
    rateTutor,
    rateStudent,
    reportSession,
    getAdminView
} from "../controllers/session.controllers.js";
import {  
    getTutorsByClass,
    getClassesByTutor,
    insertTutorClasses,
    deleteTutorClasses
} from "../controllers/tutor-classes.controller.js";

import {
    getClassesList
} from "../controllers/classes.controller.js";

import { 
    createUser,
    checkUser,
    registerUser,
    testRegister,
    checkIfRegistered
} from "../controllers/register.controllers.js";

import {    
    getLogrosByUser
} from "../controllers/logros.controller.js";

const router = Router();

router.get('/ping', async (req, res)=>{
    const [rows] = await pool.query('SELECT "Hello world" AS result');
    res.json(rows[0]);
}) 

//Session----------
router.post('/session', requestSession)
router.get('/session/:id', getSessionsByStudent)
router.get('/classes/tutor/:user', getClassesList)
router.get('/session/tutor/:id', getSessionsByTutor)
router.get('/session/tutor/:id/:date', getTutorSessionsByDate)
router.put('/session/accept/:sessionId', acceptSession)
router.put('/session/cancel/:sessionId', cancelSession)
router.put('/session/update/date/:sessionId', updateDate)
router.put('/session/update/place/:sessionId', updatePlace)
router.put('/session/update/topic/:sessionId', updateTopic)
router.put('/session/update/date-place/:sessionId', updateDatePlace)
router.put('/session/update/date-topic/:sessionId', updateDateTopic)
router.put('/session/update/place-topic/:sessionId', updatePlaceTopic)
router.put('/session/update/all/:sessionId', updateAll)
router.put('/session/rate/tutor/:sessionId', rateTutor)
router.put('/session/rate/student/:sessionId', rateStudent)
router.post('/report', reportSession)
router.get('/adminview', getAdminView)


//Tutor------------
router.get('/tutor/:tutorId', getTutorsByClass)
router.post('/tutor/classes', insertTutorClasses)
router.delete('/tutor/classes/:tutorId', deleteTutorClasses)

//Classes----------
router.get('/classes/:classId', getClassesByTutor)

//Register-------------
router.post('/register', registerUser)
router.post('/register/check', checkIfRegistered)
router.post('/testRegister', testRegister)
router.post('/newUser', createUser)
router.get('/checkUser/:user', checkUser)

//Logros-------------
router.get('/logros/:user', getLogrosByUser)

export default router;