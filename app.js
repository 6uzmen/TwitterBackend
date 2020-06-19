require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const apiRouter = require("./routes/api");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
