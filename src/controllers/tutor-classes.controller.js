import { pool } from "../db.js"

export const getTutorsByClass = async (req, res) => {
    const [result] = await pool.query("SELECT name FROM tutor_classes a INNER JOIN user b ON a.id_tutor = b.id WHERE id_classes = ?", [
        req.params.tutorId,
    ])
    if(result.length == 0)
        return res.status(404).json({message: "Tutors not found"});

    res.json(result)
}

export const getClassesByTutor = async (req, res) => {
    const [result] = await pool.query("SELECT id_classes, name FROM tutor_classes a INNER JOIN classes b ON a.id_classes = b.id WHERE id_tutor = ?", [
        req.params.classId,
    ])
    if(result.length == 0)
        return res.status(404).json({message: "Classes not found"});

    res.json(result)
}

export const insertTutorClasses = async (req, res) => {
    const { id_tutor, id_class} = req.body;
    const [result] = await pool.query(
        "INSERT INTO tutor_classes(id_tutor, id_classes) VALUES (?, ?)",
        [id_tutor, id_class]
    );

    res.json(result);
}

export const deleteTutorClasses = async (req, res) => {
    const [result] = await pool.query(
        "DELETE FROM tutor_classes WHERE id_tutor = ?",
        [req.params.tutorId]
    );

    res.json(result);
}