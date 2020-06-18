require("dotenv").config();

const express = require("express");
var cors = require('cors')
const app = express();

const apiRouter = require("./routes/api");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors())
app.use("/api",apiRouter);


app.listen(3002)