const express = require("express");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const Comment = require("../models/comments");
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');
const tag = require("../models/schema/tag");

const router = express.Router();

// To get Questions by Filter
const getQuestionsByFilter = async (req, res) => {
    let content = req.query;
    
    let f = await getQuestionsByOrder(content.order);

    let s = await filterQuestionsBySearch(f, content.search);

    res.send(s);
};

// To get Questions by Id
const getQuestionById = async (req, res) => {
    let question = await Question.findOneAndUpdate(
        {_id: req.params.qid},
        {$inc: {views: 1}},
        {new: true}
    ).populate([
        {path: "answers", populate: {path: "comments"}},
        {path: "comments"},
        {path: "tags"},
    ]);
    
    res.send(question);
};

// To add Question
const addQuestion = async (req, res) => {
    let content = req.body;

    let tagIdList = [];

    for (let t of content.tags) {
        tagIdList.push(await addTag(t));
    }

    let newQuestion = await Question.create({
        title: content.title,
        text: content.text,
        asked_by: content.asked_by, 
        answers: content.answers,
        comments: content.comments, 
        tags: tagIdList, 
        ask_date_time: new Date(),
        views: 0,
        upvote: [], 
        downvote: [], 
    });

    res.json(newQuestion);
};

const upvoteQuestion = async (req, res) => {
    let content = req.query;
    console.log(content)

    let question = await Question.findOneAndUpdate({_id: content.qid}, {$addToSet: {upvote: content.username}});
    question = await Question.findOneAndUpdate({_id: content.qid},{$pull: {downvote: content.username}});

    res.json(question)
}

const downvoteQuestion = async (req, res) => {
    let content = req.query;
    console.log(content)

    let question = await Question.findOneAndUpdate({_id: content.qid}, {$addToSet: {downvote: content.username}});
    question = await Question.findOneAndUpdate({_id: content.qid},{$pull: {upvote: content.username}});

    res.json(question)
}

// add appropriate HTTP verbs and their endpoints to the router
router.get('/getQuestion', getQuestionsByFilter);
router.get('/getQuestionById/:qid', getQuestionById);
router.post('/addQuestion', addQuestion);  // adding a question
router.get('/upvoteQuestion', upvoteQuestion);
router.get('/downvoteQuestion', downvoteQuestion);

module.exports = router;
