const express = require("express");
const router = express.Router();
const song = require("../models/songModel");

router.get("/getall", song.getall);
router.get("/getone/:id", song.getone);
router.post("/save", song.save);
router.put("/update/:id", song.update);
router.delete("/delete/:id", song.delete);

module.exports = router;
