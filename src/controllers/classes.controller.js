import { pool } from "../db.js"

export const getClassesList = async (req, res) => {
    
        const [rows] = await pool.query('SELECT c.id, c.name, CASE WHEN tc.id_tutor IS NOT NULL THEN true ELSE false END AS is_tutor FROM classes c LEFT JOIN tutor_classes tc ON c.id = tc.id_classes AND tc.id_tutor = ?', 
        [req.params.user])
        res.json(rows)
}