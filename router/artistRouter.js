const express = require("express");
const router = express.Router();
const artist = require("../models/artistModel");

router.get("/getall", artist.getall);
router.get("/getone/:id", artist.getone);
router.post("/save", artist.save);
router.put("/update/:id", artist.update);
router.delete("/delete/:id", artist.delete);

module.exports = router;
