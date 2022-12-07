const express = require("express");
const router = express.Router();
const album = require("../models/albumModel");

router.get("/getall", album.getall);
router.get("/getone/:id", album.getone);
router.post("/save", album.save);
router.put("/update/:id", album.update);
router.delete("/delete/:id", album.delete);

module.exports = router;
