const express = require("express");
const connection = require("./Connection/db");
const bodyParser = require("body-parser")
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const authrouter=require("./Routes/user")
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api",authrouter);
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  try {
    await connection, console.log("connected to db successfully");
  } catch {
    console.log("something went wrong while connecting to db");
  }
  console.log(`Server started on port http://localhost/${PORT}`);
});