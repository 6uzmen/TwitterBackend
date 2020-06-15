/**
 * Se conecta a la base de datos y exporta los modelos.
 */
const mongoose = require("mongoose");

const User = require("./User");
const Tweet = require("./Tweet");

mongoose.connect("mongodb+srv://user:user@cluster0-ijws4.gcp.mongodb.net/twitter-camilo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => {
  console.log(`Error de conexión: ${err}.`);
});

module.exports = { User, Tweet };