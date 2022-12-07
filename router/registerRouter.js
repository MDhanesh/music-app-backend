const express = require("express");
const router = express.Router();
const register = require("../models/loginModel");

router.post("/signup", register.signup);
router.post("/signin", register.signin);

//
router.get("/login", register.Login);
//
router.get("/getall", register.getall);
router.put("/update/:id", register.update);

router.post("/forgot", register.forgot);
router.get("/resetpassword/:id/:token", register.resetpassword);
router.post("/resetpassword/:id/:token", register.resetpassword);

router.delete("/delete/:id", register.delete);
//
module.exports = router;
