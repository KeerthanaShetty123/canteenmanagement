import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

// SIGNUP
router.post("/signup", (req, res) => {
    const { name, email, phone, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.json({ error: err });

        const sql = "INSERT INTO users (name, email, phone, password) VALUES (?,?,?,?)";
        db.query(sql, [name, email, phone, hash], (err, result) => {
            if (err) return res.json({ error: err });
            res.json({ message: "User Registered Successfully" });
        });
    });
});

// LOGIN
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, data) => {
        if (err) return res.json({ error: err });
        if (data.length === 0) return res.json({ error: "User not found" });

        bcrypt.compare(password, data[0].password, (err, result) => {
            if (!result) return res.json({ error: "Wrong Password" });

            res.json({ message: "Login Success", user: data[0] });
        });
    });
});

export default router;
