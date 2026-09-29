const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const Comment = require("../models/comments");

const router = express.Router();

// Adding answer
const addAnswer = async (req, res) => {
    const qid = req.body.qid;
    let content = req.body.ans;

    let a = await Answer.create(content);

    await Question.findOneAndUpdate({_id: qid}, {$push : {answers: {$each: [a._id], $position: 0}}}, {new: true});

    res.json(a);
    console.log(req.body)

};

const upvoteAnswer = async (req, res) => {
    const { aid, username } = req.query;
    await Answer.findOneAndUpdate({ _id: aid }, { $addToSet: { upvote: username } });
    const answer = await Answer.findOneAndUpdate(
        { _id: aid },
        { $pull: { downvote: username } },
        { new: true }
    );
    res.json(answer);
};

const downvoteAnswer = async (req, res) => {
    const { aid, username } = req.query;
    await Answer.findOneAndUpdate({ _id: aid }, { $addToSet: { downvote: username } });
    const answer = await Answer.findOneAndUpdate(
        { _id: aid },
        { $pull: { upvote: username } },
        { new: true }
    );
    res.json(answer);
};

const acceptAnswer = async (req, res) => {
    const { qid, aid, username } = req.body;
    const question = await Question.findById(qid);

    if (!question || question.asked_by !== username) {
        res.status(403).json({ error: "Only the question author can accept an answer" });
        return;
    }

    const belongs = (question.answers || []).some((id) => String(id) === String(aid));
    if (!belongs) {
        res.status(400).json({ error: "That answer is not on this question" });
        return;
    }

    const alreadyAccepted = question.accepted_answer && String(question.accepted_answer) === String(aid);
    const updated = await Question.findOneAndUpdate(
        { _id: qid },
        alreadyAccepted ? { $unset: { accepted_answer: "" } } : { accepted_answer: aid },
        { new: true }
    );

    res.json({ accepted_answer: updated.accepted_answer || null });
};


// add appropriate HTTP verbs and their endpoints to the router.
router.post('/addAnswer', addAnswer);
router.get('/upvoteAnswer', upvoteAnswer);
router.get('/downvoteAnswer', downvoteAnswer);
router.post('/acceptAnswer', acceptAnswer);

module.exports = router;
