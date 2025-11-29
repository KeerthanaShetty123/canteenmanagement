import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all menu items
router.get("/", (req, res) => {
    db.query("SELECT * FROM menu_items", (err, data) => {
        if (err) return res.json({ error: err });
        res.json(data);
    });
});

// Add item (admin)
router.post("/add", (req, res) => {
    const { name, price, image } = req.body;

    const sql = "INSERT INTO menu_items (name, price, image) VALUES (?,?,?)";
    db.query(sql, [name, price, image], (err, result) => {
        if (err) return res.json({ error: err });
        res.json({ message: "Menu Item Added" });
    });
});

// Delete item
router.delete("/delete/:id", (req, res) => {
    db.query("DELETE FROM menu_items WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.json({ error: err });
        res.json({ message: "Item Deleted" });
    });
});

export default router;
