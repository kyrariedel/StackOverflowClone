const Tag = require("../models/tags");
const Question = require("../models/questions");

const addTag = async (tname) => {
    let tags = await Tag.findOne({name: tname});

    if (tags) {
        return tags._id;
    }

    let tag = await Tag.create({ name: tname });
    let t = await tag.save();

    return t._id;
};

const getQuestionsByOrder = async (order) => {
    let questions = await Question.find().populate({path: "tags"});

    let q = [];
    if (order == 'newest') {
        q = questions.sort((a, b) => (
            b.ask_date_time - a.ask_date_time
        ));
    } else if (order == 'active') {
        q = questions.filter((q) => (q.answers.length > 0));
        let qn = questions.filter((q) => (q.answers.length == 0));

        let ansList = [];

        for (let b of q) {
            let currDate = new Date(-8640000000000000);
            for (let c of b.answers) {
                if (c.ans_date_time > currDate) {
                    currDate = c.ans_date_time;
                }
            }
            ansList.push({ qu: b, ansDate: currDate });
        }

        ansList.sort(function(a, b) {
            if (a.ansDate.getTime() == b.ansDate.getTime()) return b.qu.ask_date_time - a.qu.ask_date_time;
            else return b.ansDate - a.ansDate;
        });

        q = [];

        for (let d of ansList) {
            q.push(d.qu);
        }

        q.push(...qn);
        
    } else if (order == 'unanswered') {
        q = questions.filter((q) => (q.answers.length == 0));
        q = q.sort((a, b) => (
            b.ask_date_time - a.ask_date_time
        ));
    }

    return q;
}

const filterQuestionsBySearch = async (qlist, search = "") => {
    if (search.length == 0) {
        return qlist;
    }
    let searchTags = (search.match(/\[([^\]]+)\]/g) || []).map((word) =>word.slice(1, -1));
    let searchKeyword = search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];

    let title = [];
    let text = [];

    if (searchKeyword.length > 0) {
        title = qlist.filter((q) => (q.title.includes(searchKeyword)));
        text = qlist.filter((q) => (q.text.includes(searchKeyword)));
    }

    let tags = []
    if (searchTags.length > 0) {
        for (let q of qlist) {
            for (let t of q.tags) {
                for (let a of searchTags) {
                    if (t.name == a) {
                        tags.push(q);
                    }
                }

            }
        }
    }


    const mergedArray = [...new Set([...tags, ...title, ...text])];
    return mergedArray;
}


module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch };