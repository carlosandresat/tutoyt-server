import { pool } from "../db.js"

export const checkUser = async (req, res) => {
    const [result] = await pool.query("SELECT * FROM user WHERE user = ?", [
        req.params.user,
    ])
    if(result.length == 0)
        return res.json({status: "Success"})
    else
        return res.json({message: "Usuario ya existente"})
}

export const createUser = async (req, res) => {
    const { name, password, user} = req.body;
    const [result] = await pool.query(
        "INSERT INTO user(name, password, user, status) VALUES (?, ?, ?, 0)",
        [name, password, user]
    );

    res.json({
        id: result.insertId,
        name,
        password,
        user
    });
}

