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

export const getSessionsByStudent = async (req, res) => {
    const [result] = await pool.query("SELECT status, DATE_FORMAT(date, '%d/%c/%Y') AS date, TIME_FORMAT(time, '%H:%i') as time, name, code FROM session INNER JOIN (SELECT classes.id, classes.name, code FROM classes INNER JOIN school ON classes.id_school = school.id) classdata ON session.id_class = classdata.id WHERE id_student = (SELECT id from user WHERE user = ?) ORDER BY date, time", [
        req.params.user,
    ])
    if(result.length == 0)
        return res.status(404).json({message: "No hay tutorías"});

    res.json(result)
}
