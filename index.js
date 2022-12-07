const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./connect");
const registerRouter = require("./router/registerRouter");
const albumRouter = require("./router/albumRouter");
const artistRouter = require("./router/artistRouter");
const songRouter = require("./router/songRouter");

dotenv.config();
db();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/register", registerRouter);
app.use("/album", albumRouter);
app.use("/artist", artistRouter);
app.use("/songs", songRouter);

app.listen(process.env.PORT);
