require("dotenv").config();

const express = require("express");
const app = express();

const apiRouter = require("./routes/api");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api",apiRouter);


app.listen(3000)