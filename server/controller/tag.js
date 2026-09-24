const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
    let content = await Tag.find();
    let questions = await Question.find().populate({path: "tags"});
    let map = new Map();
    for (let c of content) {
        map.set(c.name, 0);
    }

    for (let q of questions) {
        for (let t of q.tags) {
            if (map.has(t.name)) {
                map.set(t.name, (map.get(t.name))+1);
            }
        }
    }

    let arr = [];
    map.forEach((qcnt, name) => arr.push({name, qcnt}));
    
    res.send(arr);
};

// add appropriate HTTP verbs and their endpoints to the router.
router.get('/getTagsWithQuestionNumber', getTagsWithQuestionNumber);

module.exports = router;
