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
    const { name, user, password, classroom, phone} = req.body;
    const [isRegistered] = await pool.query(
        "SELECT * FROM user WHERE user = ?",
        [user]
    );
    if(isRegistered.length != 0){
        return res.json({message: "Usuario ya registrado"})
    } else {
        await pool.query(
            "INSERT INTO user(name, user, password, classroom, phone, status, created_at) VALUES (?, ?, ?, ?, ?, 'estudiante', NOW())",
            [name, user, password, classroom, phone]
        );
        return res.json({
            status: "Success"
        });
    
    }
}

export const registerUser = async (req, res) => {
    const { user_id, name, pic_url, nickname} = req.body;
    const [result] = await pool.query(
        "INSERT INTO user(id, name, pic_url, nickname) VALUES (?, ?, ?, ?)",
        [user_id, name, pic_url, nickname]
    );

    res.json(result);
}

export const testRegister = async (req, res) => {
    console.log(req.body)

    res.json(req.body);
}

export const checkIfRegistered = async (req, res) => {

    const { user_id } = req.body;

    const [result] = await pool.query("SELECT * FROM user WHERE id = ?", [
        user_id,
    ])
    if(result.length == 0)
        return res.json({message: "Usuario no registrado"})
    else
        return res.json({status: "Success"})
}