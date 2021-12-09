const express = require("express");
const dataSchema = require("../models/data");

const router = express.Router();

// storing the data
router.post("/storedata", (req, res) => {
  const data = dataSchema(req.body);

  data
    .save()
    .then((x) => res.json(x))
    .catch((err) => res.json({ message: err }));
});

// get all data
router.get("/storeddata", (req, res) => {
  dataSchema
    .find()
    .then((x) => res.json(x))
    .catch((err) => res.json({ message: err }));
});

module.exports = router;
