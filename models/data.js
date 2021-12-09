const mongoose = require("mongoose");
const dateTime = require("get-date");

const dataSchema = mongoose.Schema({
  autorizador: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    required: true,
  },
  fecha: {
    type: String,
    default: dateTime(false),
  },
});

module.exports = mongoose.model("Data", dataSchema);
