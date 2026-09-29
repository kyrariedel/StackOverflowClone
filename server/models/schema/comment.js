const mongoose = require("mongoose");

// Schema for questions
module.exports = mongoose.Schema(
    {
        text: {type: String, required: true},
        com_by: {type: String, required: true},
        com_date_time: {type: Date, required: true},
        upvote: [{type: String}],
    },
    { collection: "Comment" }
);
