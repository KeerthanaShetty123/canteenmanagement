import express from "express";
import db from "../db.js";

const router = express.Router();

// Place an order
router.post("/place", (req, res) => {
    const { user_id, items, total_price } = req.body;

    const sql = "INSERT INTO orders (user_id, items, total_price) VALUES (?,?,?)";
    db.query(sql, [user_id, JSON.stringify(items), total_price], (err, result) => {
        if (err) return res.json({ error: err });
        res.json({ message: "Order Placed" });
    });
});

// Fetch all orders (admin)
router.get("/", (req, res) => {
    db.query("SELECT * FROM orders", (err, data) => {
        if (err) return res.json({ error: err });
        res.json(data);
    });
});

export default router;
