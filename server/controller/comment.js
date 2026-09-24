const express = require("express");
const Comment = require("../models/comments");
const Question = require("../models/questions");
const Answer = require("../models/answers");

const router = express.Router();

const addComment = async (req, res) => {
    const { qid, aid, com } = req.body;
    let content = com;
    let c = await Comment.create(content);
    
    // Check if the comment is for a question or an answer
    if (aid == null) {
        // If aid is null, it means the comment is for a question
        await Question.findOneAndUpdate(
            { _id: qid },
            { $push: { comments: { $each: [c._id], $position: 0 } } },
            { new: true }
        );
        console.log(qid)
    } else {
        // If aid is not null, it means the comment is for an answer
        await Answer.findOneAndUpdate(
            { _id: aid },
            { $push: { comments: { $each: [c._id], $position: 0 } } },
            { new: true }
        ).popilate('comments')
    }
    res.json(c);
};

// add appropriate HTTP verbs and their endpoints to the router.
router.post('/addComment', addComment);
module.exports = router;