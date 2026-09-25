// Local MongoDB by default. Compose sets MONGO_URL to mongodb://mongodb:27017/fake_so.
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/fake_so";
const CLIENT_URL = "http://localhost:3000";
const port = 8000;

module.exports = {
    MONGO_URL,
    CLIENT_URL,
    port
};
