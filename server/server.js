// // Application server

// const express = require("express");
// const mongoose = require("mongoose");

// const { MONGO_URL, port } = require("./config");

// mongoose.connect(MONGO_URL);

// const app = express();

// app.get("/", (_, res) => {
//     res.send("Fake SO Server Dummy Endpoint");
//     res.end();
// });

// let server = app.listen(port, () => {
//     console.log(`Server starts at http://localhost:${port}`);
// });

// process.on("SIGINT", () => {
//     server.close();
//     mongoose.disconnect();
//     console.log("Server closed. Database instance disconnected");
//     process.exit(0);
// });


// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MONGO_URL, CLIENT_URL, port } = require("./config");

mongoose.connect(MONGO_URL);

const app = express();

app.use(
    cors({
        credentials: true,
        origin: [CLIENT_URL],
    })
);

app.use(express.json());

app.get("", (req, res) => {
    res.send("hello world");
    res.end();
});

const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");
const accountController = require("./controller/account")
const commentController = require("./controller/comment");


app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);
app.use("/account", accountController);
app.use("/comment", commentController);

let server = app.listen(port, () => {
    console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
    server.close();
    mongoose.disconnect();
    console.log("Server closed. Database instance disconnected");
    process.exit(0);
});

module.exports = server
