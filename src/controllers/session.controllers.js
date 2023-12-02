import { pool } from "../db.js"
import {default as Twilio} from "twilio"

const accountSid = 'AC948e6e776ff454348e57f05923c2bf26';
const authToken = '98ea1068712edfeee136c9d778871131';
const client = Twilio(accountSid, authToken);

function formatDateToLocalString(dateTime) {
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }


export const requestSession = async (req, res) => {
    const { student, tutor, className, datetime, place, topic, duration} = req.body;
    const serverDate = new Date(datetime)
    console.log('Tutoring request at: ', formatDateToLocalString(serverDate), " by user ", student)


    const [result] = await pool.query(
        "INSERT INTO session(id_student, id_tutor, id_class, status, date, place, topic, duration) VALUES (?, ?, (SELECT id FROM classes where name= ?), 'requested', ?, ?, ?, ?)",
        [student, tutor, className, formatDateToLocalString(serverDate), place, topic, duration]
    );

    /*const message = await client.messages.create({
        body: 'Conf si funciona Karyyyy',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+593963963170',
        sendAt: serverDate.toISOString()
    });*/

    const [newTutoring] = await pool.query("SELECT status, date as date_raw, DATE_FORMAT(date, '%d/%c/%Y') AS date, code FROM session INNER JOIN (SELECT classes.id, code FROM classes INNER JOIN school ON classes.id_school = school.id) classdata ON session.id_class = classdata.id WHERE session.id =  ?", [
        result.insertId,
    ])

    res.json({
        id: result.insertId,
        name: className, 
        date_raw: newTutoring[0].date_raw,
        date: newTutoring[0].date, 
        place,
        duration,
        topic,
        tutor,
        status: 'requested',
        code: newTutoring[0].code
    });
}

export const getSessionsByTutor = async (req, res) => {
    const [result] = await pool.query("SELECT session.id, session.topic, session.status, session.place, date as date_raw, DATE_FORMAT(date, '%d/%c/%Y') AS date, TIME_FORMAT(date, '%H:%i') as time, session.duration, classes.name as classname, user.user as student, session.rate_student FROM session INNER JOIN classes ON session.id_class = classes.id INNER JOIN user ON session.id_student = user.id WHERE id_tutor = ? AND DATE(date) >= CURDATE() - 1 ORDER BY date_raw", [
        req.params.id,
    ])
    if(result.length == 0)
        return res.status(404).json({message: "No hay tutorías"});

    res.json(result)
}

export const getSessionsByStudent = async (req, res) => {
    const [result] = await pool.query("SELECT session.id, session.topic, user.user as tutor, session.status, session.changes, date as date_raw, DATE_FORMAT(date, '%d/%c/%Y') AS date, TIME_FORMAT(date, '%H:%i') as time, session.duration, session.place, classdata.name, code, session.rate_tutor FROM session INNER JOIN (SELECT classes.id, classes.name, code FROM classes INNER JOIN school ON classes.id_school = school.id) classdata ON session.id_class = classdata.id INNER JOIN user ON user.id = session.id_tutor WHERE id_student = ? AND DATE(date) >= CURDATE() - 1 ORDER BY date_raw", [
        req.params.id,
    ])

    if(result.length == 0)
        return res.status(404).json({message: "No hay tutorías"});

    res.json(result)
}

export const getTutorSessionsByDate = async (req, res) => {
    const [result] = await pool.query("SELECT session.id, date, duration FROM session WHERE id_tutor = ? AND DATE(date) = ?", [
        req.params.id, req.params.date
    ])
    
    const result2 = result.map((item) => {
        return {
            ...item,
            duration: Number(item.duration)
        }
    })

    res.json(result2)
}

export const cancelSession = async (req, res) => {
    const result = await pool.query("UPDATE session SET status = 'canceled' WHERE id = ?", [
        req.params.sessionId,
    ]);
    res.json(result)
}

export const acceptSession = async (req, res) => {
    const result = await pool.query("UPDATE session SET status = 'accepted' WHERE id = ?", [
        req.params.sessionId,
    ]);
    res.json(result)
}

export const updateDate = async (req, res) => {
    const { date } = req.body;

    const serverDate = new Date(date)

    const result = await pool.query("UPDATE session SET date = ?, changes = 'fecha/hora', status = 'changed' WHERE id = ?", [
        formatDateToLocalString(serverDate), req.params.sessionId
    ]);

    console.log(result)
    res.json({ 
        date, 
    })
}

export const updatePlace = async (req, res) => {
    const { place } = req.body;

    const result = await pool.query("UPDATE session SET place = ?, changes = 'lugar', status = 'changed' WHERE id = ?", [
        place, req.params.sessionId
    ]);
    res.json({ place })
}

export const updateTopic = async (req, res) => {
    const { topic } = req.body;

    const result = await pool.query("UPDATE session SET topic = ?, changes = 'tema', status = 'changed' WHERE id = ?", [
        topic, req.params.sessionId
    ]);
    res.json({ topic })
}

export const updateDatePlace = async (req, res) => {
    const { date, place } = req.body;
    const serverDate = new Date(date)

    const result = await pool.query("UPDATE session SET date = ?,  place = ?, changes = 'fecha/hora y lugar', status = 'changed' WHERE id = ?", [
        formatDateToLocalString(serverDate), place, req.params.sessionId
    ]);
    res.json({ date, place })
}

export const updateDateTopic = async (req, res) => {
    const { date, topic } = req.body;
    const serverDate = new Date(date)

    const result = await pool.query("UPDATE session SET date = ?, topic = ?, changes = 'fecha/hora y tema', status = 'changed' WHERE id = ?", [
        formatDateToLocalString(serverDate), topic, req.params.sessionId
    ]);
    res.json({ date, topic })
}

export const updatePlaceTopic = async (req, res) => {
    const { place, topic } = req.body;

    const result = await pool.query("UPDATE session SET place = ?,  topic = ?, changes = 'lugar y tema', status = 'changed' WHERE id = ?", [
        place, topic, req.params.sessionId
    ]);
    res.json({ place, topic })
}

export const updateAll = async (req, res) => {
    const { date, place, topic } = req.body;
    const serverDate = new Date(date)

    const result = await pool.query("UPDATE session SET date = ?, place = ?,  topic = ?, changes = 'fecha/hora, lugar y tema', status = 'changed' WHERE id = ?", [
        formatDateToLocalString(serverDate), place, topic, req.params.sessionId
    ]);
    res.json({
        date,
        place,
        topic,
    })
}

export const rateTutor = async (req, res) => {
    const { rate, comment } = req.body;

        const result = await pool.query("UPDATE session SET rate_tutor = ?, comment_tutor= ? WHERE id = ?", [
            rate, comment, req.params.sessionId
        ]);
        res.json(result)        
}


export const rateStudent = async (req, res) => {
    const { rate, comment } = req.body;

    const result = await pool.query("UPDATE session SET rate_student = ?, comment_student = ? WHERE id = ?", [
        rate, comment,  req.params.sessionId
    ]);
    res.json(result)
}

export const reportSession = async (req, res) => {
    const { id_session, id_reporter, comment } = req.body;

    const result = await pool.query("INSERT INTO session_reports(id_session, id_reporter, comment) VALUES (?, ?, ?)", [
        id_session, id_reporter, comment
    ])
    res.json(result)
}

export const getAdminView = async (req, res) => {
    
    const [result] = await pool.query("SELECT s.*, u.name as student, v.name as tutor, c.name AS classname FROM session s INNER JOIN user u ON s.id_student = u.id INNER JOIN user v ON s.id_tutor = v.id INNER JOIN classes c ON s.id_class = c.id ORDER BY date")
    if(result.length == 0)
        return res.json({message: "No hay tutorías"});

    res.json(result)
}