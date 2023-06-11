const express = require("express");
const app = express();
const { connection } = require("./db");
require("dotenv").config();

const cors = require("cors");

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`Server up and running at ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
