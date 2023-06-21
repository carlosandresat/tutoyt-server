import { pool } from "../db.js"

export const requestSession = async (req, res) => {
    const { student, tutor, className, date, time, place, topic} = req.body;
    const [result] = await pool.query(
        "INSERT INTO session(id_student, id_tutor, id_class, status, date, time, place, topic) VALUES (?, (SELECT id FROM user where name= ?), (SELECT id FROM classes where name= ?), 'requested', ?, ?, ?, ?)",
        [student, tutor, className, date, time, place, topic]
    );

    const [newTutoring] = await pool.query("SELECT status, date as date_raw, DATE_FORMAT(date, '%d/%c/%Y') AS date, code FROM session INNER JOIN (SELECT classes.id, code FROM classes INNER JOIN school ON classes.id_school = school.id) classdata ON session.id_class = classdata.id WHERE session.id =  ?", [
        result.insertId,
    ])

    res.json({
        id: result.insertId,
        name: className, 
        date_raw: newTutoring[0].date_raw,
        date: newTutoring[0].date, 
        time,
        place,
        topic,
        tutor,
        status: newTutoring[0].status,
        code: newTutoring[0].code
    });
}

export const getSessionsByTutor = async (req, res) => {
    const [result] = await pool.query("SELECT session.id, session.topic, session.status, session.place, date as date_raw, DATE_FORMAT(date, '%d/%c/%Y') AS date, TIME_FORMAT(time, '%H:%i') as time, classes.name as classname, user.name as student FROM session INNER JOIN classes ON session.id_class = classes.id INNER JOIN user ON session.id_student = user.id WHERE id_tutor = ? AND date >= CURDATE() - 1 ORDER BY date_raw, time", [
        req.params.id,
    ])
    if(result.length == 0)
        return res.status(404).json({message: "No hay tutorías"});

    res.json(result)
}

export const getSessionsByStudent = async (req, res) => {
    const [result] = await pool.query("SELECT session.id, session.topic, user.name as tutor, session.status, session.changes, date as date_raw, DATE_FORMAT(date, '%d/%c/%Y') AS date, TIME_FORMAT(time, '%H:%i') as time, session.place, classdata.name, code FROM session INNER JOIN (SELECT classes.id, classes.name, code FROM classes INNER JOIN school ON classes.id_school = school.id) classdata ON session.id_class = classdata.id INNER JOIN user ON user.id = session.id_tutor WHERE id_student = ? AND date >= CURDATE() - 1 ORDER BY date_raw, time", [
        req.params.id,
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

    const result = await pool.query("UPDATE session SET date = ?, time = ?, changes = 'fecha/hora', status = 'changed' WHERE id = ?", [
        date, time, req.params.sessionId
    ]);
    res.json({ 
        date, 
        time
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
    const { date, time, place } = req.body;

    const result = await pool.query("UPDATE session SET date = ?, time = ?,  place = ?, changes = 'fecha/hora y lugar', status = 'changed' WHERE id = ?", [
        date, time, place, req.params.sessionId
    ]);
    res.json({ date, time, place })
}

export const updateDateTopic = async (req, res) => {
    const { date, time, topic } = req.body;

    const result = await pool.query("UPDATE session SET date = ?, time = ?,  topic = ?, changes = 'fecha/hora y tema', status = 'changed' WHERE id = ?", [
        date, time, topic, req.params.sessionId
    ]);
    res.json({ date, time, topic })
}

export const updatePlaceTopic = async (req, res) => {
    const { place, topic } = req.body;

    const result = await pool.query("UPDATE session SET place = ?,  topic = ?, changes = 'lugar y tema', status = 'changed' WHERE id = ?", [
        place, topic, req.params.sessionId
    ]);
    res.json({ place, topic })
}

export const updateAll = async (req, res) => {
    const { date, time, place, topic } = req.body;

    const result = await pool.query("UPDATE session SET date = ?, time = ?, place = ?,  topic = ?, changes = 'fecha/hora, lugar y tema', status = 'changed' WHERE id = ?", [
        date, time, place, topic, req.params.sessionId
    ]);
    res.json({
        date,
        time,
        place,
        topic,
    })
}

export const rateSession = async (req, res) => {
    const { rate } = req.body;

    const result = await pool.query("UPDATE session SET stars = ?, status = 'done' WHERE id = ?", [
        rate, req.params.sessionId
    ]);
    res.json(result)
}