import { pool } from "../db.js"

export const requestSession = async (req, res) => {
    const { student, tutor, className, date, time, topic} = req.body;
    const [result] = await pool.query(
        "INSERT INTO session(id_student, id_tutor, id_class, status, date, time, topic) VALUES ((SELECT id FROM user where user= ?), (SELECT id FROM user where name= ?), (SELECT id FROM classes where name= ?), 'requested', ?, ?, ?)",
        [student, tutor, className, date, time, topic]
    );

    const [newTutoring] = await pool.query("SELECT status, DATE_FORMAT(date, '%d/%c/%Y') AS date, code FROM session INNER JOIN (SELECT classes.id, code FROM classes INNER JOIN school ON classes.id_school = school.id) classdata ON session.id_class = classdata.id WHERE session.id =  ?", [
        result.insertId,
    ])

    res.json({
        id: result.insertId,
        name: className, 
        date: newTutoring[0].date, 
        time,
        status: newTutoring[0].status,
        code: newTutoring[0].code
    });
}

export const getSessionsByTutor = async (req, res) => {
    const [result] = await pool.query("SELECT session.id, session.topic, session.status, date as date_raw, DATE_FORMAT(date, '%d/%c/%Y') AS date, TIME_FORMAT(time, '%H:%i') as time, classes.name as classname, user.name as student FROM session INNER JOIN classes ON session.id_class = classes.id INNER JOIN user ON session.id_student = user.id WHERE id_tutor = (SELECT id from user WHERE user = ?) AND date >= CURDATE() ORDER BY date_raw, time", [
        req.params.user,
    ])
    if(result.length == 0)
        return res.status(404).json({message: "No hay tutorías"});

    res.json(result)
}

export const getSessionsByStudent = async (req, res) => {
    const [result] = await pool.query("SELECT session.id, status, date as date_raw, DATE_FORMAT(date, '%d/%c/%Y') AS date, TIME_FORMAT(time, '%H:%i') as time, name, code FROM session INNER JOIN (SELECT classes.id, classes.name, code FROM classes INNER JOIN school ON classes.id_school = school.id) classdata ON session.id_class = classdata.id WHERE id_student = (SELECT id from user WHERE user = ?) AND date >= CURDATE() ORDER BY date_raw, time", [
        req.params.user,
    ])
    if(result.length == 0)
        return res.status(404).json({message: "No hay tutorías"});

    res.json(result)
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
    const { date, time } = req.body;

    const result = await pool.query("UPDATE session SET date = ?, time = ?, changes = 'fecha/hora' WHERE id = ?", [
        date, time, req.params.sessionId
    ]);
    res.json({ 
        date, 
        time
    })
}

export const updatePlace = async (req, res) => {
    const { place } = req.body;

    const result = await pool.query("UPDATE session SET place = ?, changes = 'lugar' WHERE id = ?", [
        place, req.params.sessionId
    ]);
    res.json({ place })
}

export const updateTopic = async (req, res) => {
    const { topic } = req.body;

    const result = await pool.query("UPDATE session SET topic = ?, changes = 'tema' WHERE id = ?", [
        topic, req.params.sessionId
    ]);
    res.json({ topic })
}

export const updateDatePlace = async (req, res) => {
    const { date, time, place } = req.body;

    const result = await pool.query("UPDATE session SET date = ?, time = ?,  place = ?, changes = 'fecha/hora y lugar' WHERE id = ?", [
        date, time, place, req.params.sessionId
    ]);
    res.json({ date, time, place })
}

export const updateDateTopic = async (req, res) => {
    const { date, time, topic } = req.body;

    const result = await pool.query("UPDATE session SET date = ?, time = ?,  topic = ?, changes = 'fecha/hora y tema' WHERE id = ?", [
        date, time, topic, req.params.sessionId
    ]);
    res.json({ date, time, topic })
}

export const updatePlaceTopic = async (req, res) => {
    const { place, topic } = req.body;

    const result = await pool.query("UPDATE session SET place = ?,  topic = ?, changes = 'lugar y tema' WHERE id = ?", [
        place, topic, req.params.sessionId
    ]);
    res.json({ place, topic })
}

export const updateAll = async (req, res) => {
    const { date, time, place, topic } = req.body;

    const result = await pool.query("UPDATE session SET date = ?, time = ?, place = ?,  topic = ?, changes = 'fecha/hora, lugar y tema' WHERE id = ?", [
        date, time, place, topic, req.params.sessionId
    ]);
    res.json({
        date,
        time,
        place,
        topic,
    })
}