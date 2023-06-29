import { pool } from "../db.js"

export const getLogrosByUser = async (req, res) => {
    const [rows] = await pool.query('SELECT a.name, a.description, a.logro_url, a.tier, COUNT(DISTINCT au_user.id_user) AS owned    FROM logros_user au_user    JOIN logros a ON a.id = au_user.id_logro    WHERE au_user.id_logro IN (        SELECT id_logro        FROM logros_user        WHERE id_user = ?    )    GROUP BY a.id, a.name, a.description, a.logro_url, a.tier', [req.params.user])
    res.json(rows)
}