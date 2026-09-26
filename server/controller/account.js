const express = require("express");
const Account = require("../models/accounts")
const Question = require("../models/questions")
const Answer = require("../models/answers")

const UPVOTE_REPUTATION = 10;
const DOWNVOTE_REPUTATION = 2;

const voteReputation = (post) =>
    (post.upvote || []).length * UPVOTE_REPUTATION
    - (post.downvote || []).length * DOWNVOTE_REPUTATION;

const router = express.Router();

// Adding account
const addAccount = async (req, res) => {
    const content = req.body;

    let newAccount = await Account.create({
        username: content.username, 
        password: content.password, 
        name: content.name,
        role: content.role
    })

    res.json(newAccount);

};

const authenticateAccount = async (req, res) => {
    const content = req.query;

    let account = await Account.findOne({
        username: content.username,
        password: content.password,
    });

    if (account) {
        res.json(account.username);
    } else {
        res.json();
    }
};

const getProfile = async (req, res) => {
    const username = req.params.username;
    const account = await Account.findOne({ username });
    const questions = await Question.find({ asked_by: username });
    const answers = await Answer.find({ ans_by: username });
    const answerIds = answers.map((answer) => answer._id);
    const parentQuestions = answerIds.length
        ? await Question.find({ answers: { $in: answerIds } })
        : [];

    const questionByAnswer = new Map();
    for (const question of parentQuestions) {
        for (const answerId of question.answers || []) {
            questionByAnswer.set(String(answerId), question);
        }
    }

    const reputation = [...questions, ...answers].reduce(
        (total, post) => total + voteReputation(post),
        0
    );

    res.json({
        username,
        name: account ? account.name : username,
        reputation,
        questions: questions.map((question) => ({
            _id: question._id,
            title: question.title,
            score: (question.upvote || []).length - (question.downvote || []).length,
            views: question.views,
        })),
        answers: answers.map((answer) => {
            const parent = questionByAnswer.get(String(answer._id));
            return {
                _id: answer._id,
                text: answer.text,
                score: (answer.upvote || []).length - (answer.downvote || []).length,
                questionId: parent ? parent._id : null,
                questionTitle: parent ? parent.title : "",
            };
        }),
    });
};


// add appropriate HTTP verbs and their endpoints to the router.
router.post('/addAccount', addAccount); //adding account
router.get('/authenticateAccount', authenticateAccount);
router.get('/profile/:username', getProfile);

module.exports = router;
