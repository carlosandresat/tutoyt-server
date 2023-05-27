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