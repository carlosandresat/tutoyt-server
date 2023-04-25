import { pool } from "../db.js"

export const requestSession = async (req, res) => {
    const { student, tutor, className, date, time} = req.body;
    const [result] = await pool.query(
        "INSERT INTO session(id_student, id_tutor, id_class, status, date, time) VALUES ((SELECT id FROM user where user= ?), (SELECT id FROM user where name= ?), (SELECT id FROM classes where name= ?), 'requested', ?, ?)",
        [student, tutor, className, date, time]
    );

    res.json({
        id: result.insertId,
        student, 
        tutor, 
        className, 
        date, 
        time
    });
}

export const getSessionsByTutor = (req, res) => {
    res.send('sessions by tutor')
}

