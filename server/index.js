const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");

dotenv.config();

const port = process.env.PORT || 3000;
app.use(express.json());

app.use(cors({
    origin : [process.env.HOST],
    methods : ['GET', 'POST', 'DELETE', 'PUT'],
    credentials : true
}));


mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log("Connected succesfully"))
    .catch((err) => console.log(err));


app.listen(port, () => console.log(`Listening on port ${port}`) );