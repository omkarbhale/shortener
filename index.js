require("dotenv").config();
const connectDB = require("./db/connect.js");
const express = require("express");
const app = express();

const urlRouter = require("./routes/url.js");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set render engine to ejs
app.set("view engine", "ejs");

app.use("/", urlRouter);

const start = async () => {
    await connectDB();
    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server is running on port ${process.env.PORT || 4000}`);
    });
};
start();