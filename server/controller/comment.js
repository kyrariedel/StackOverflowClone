const express = require("express");
const Comment = require("../models/comments");
const Question = require("../models/questions");
const Answer = require("../models/answers");

const router = express.Router();

const addComment = async (req, res) => {
    const { qid, aid, com } = req.body;
    let content = com;
    let c = await Comment.create({
        ...content,
        upvote: content.upvote || [],
    });
    
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
        );
    }
    res.json(c);
};

const upvoteComment = async (req, res) => {
    const { cid, username } = req.query;
    const comment = await Comment.findOneAndUpdate(
        { _id: cid },
        { $addToSet: { upvote: username } },
        { new: true }
    );
    res.json(comment);
};

// add appropriate HTTP verbs and their endpoints to the router.
router.post('/addComment', addComment);
router.get('/upvoteComment', upvoteComment);
module.exports = router;