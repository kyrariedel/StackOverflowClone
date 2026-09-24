const mongoose = require("mongoose");

// Schema for answers
module.exports = mongoose.Schema(
    {
        // define relevant properties.
        // id: {type: String}, 
        text: {type: String, required: true},
        ans_by: {type: String, required: true},
        ans_date_time: {type: Date, required: true},
        comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}], 
        upvote: [{type: String}], 
        downvote: [{type: String}],
    },
    { collection: "Answer" }
);
