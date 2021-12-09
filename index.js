const cheerio = require("cheerio");
const request = require("request");
const axios = require("axios");
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const dataRoutes = require("./routes/data");
const dataSchema = require("./models/data");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(cors());
app.use(express.json());
app.use("/api", dataRoutes);

// routes
app.get("/", (req, res) => {
  res.send("Hello Luis, welcome to your API");
});

// mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conected to Mongo DB Atlas!"))
  .catch((err) => console.error(err));

app.listen(port, () => console.log(`Server started on Port ${port}`));

// here starts the scraper

const url = "https://www.nfe.fazenda.gov.br/portal/disponibilidade.aspx";

request(
  {
    url: url,
    jar: true,
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
  },
  (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);

      const scrapedData = [];
      $("#ctl00_ContentPlaceHolder1_gdvDisponibilidade2 > tbody > tr").each(
        (index, element) => {
          if (index === 0) return true;
          const tds = $(element).find("td");
          const autorizador = $(tds[0]).text();
          const estado = $(tds[5]).find("img").attr("src");
          let tableRow = dataSchema();
          tableRow = { autorizador, estado };
          axios
            .post("http://localhost:9000/api/storedata", tableRow)
            .then(function (response) {
              return true;
            })
            .catch((err) => console.error(err));
          scrapedData.push(tableRow);
        }
      );
      console.log(scrapedData);
    }
  }
);
