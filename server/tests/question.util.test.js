jest.mock("../models/questions");
jest.mock("../models/tags");

const Question = require("../models/questions");
const Tag = require("../models/tags");
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require("../utils/question");

const tagAndroid = { _id: "t-android", name: "android" };
const tagReact = { _id: "t-react", name: "react" };

const answeredOlder = {
    _id: "q-older",
    title: "Quick question about storage on android",
    text: "I would like to know the best way to store an array",
    tags: [tagAndroid],
    ask_date_time: new Date("2023-11-16T09:24:00"),
    answers: [
        { ans_date_time: new Date("2023-11-18T09:24:00") },
        { ans_date_time: new Date("2023-11-20T09:24:00") },
    ],
};

const answeredNewerAsk = {
    _id: "q-newer-ask",
    title: "Object storage for a web application",
    text: "I am currently working on a website",
    tags: [tagReact],
    ask_date_time: new Date("2023-11-17T09:24:00"),
    answers: [
        { ans_date_time: new Date("2023-11-19T09:24:00") },
    ],
};

const unanswered = {
    _id: "q-unanswered",
    title: "Is there a language to write programmes by pictures?",
    text: "Does something like that exist?",
    tags: [],
    ask_date_time: new Date("2023-11-21T09:24:00"),
    answers: [],
};

function mockFind(questions) {
    Question.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(questions),
    });
}

describe("getQuestionsByOrder active", () => {
    it("orders answered questions by the latest answer, then unanswered questions", async () => {
        mockFind([unanswered, answeredOlder, answeredNewerAsk]);

        const result = await getQuestionsByOrder("active");

        expect(result.map((q) => q._id)).toEqual([
            "q-older",
            "q-newer-ask",
            "q-unanswered",
        ]);
        expect(Question.find().populate).toHaveBeenCalledWith([
            { path: "tags" },
            { path: "answers" },
        ]);
    });
});

describe("filterQuestionsBySearch", () => {
    const questions = [answeredOlder, answeredNewerAsk, unanswered];

    it("matches each keyword separately, ignoring case", async () => {
        const result = await filterQuestionsBySearch(questions, "WEBSITE pictures");

        expect(result.map((q) => q._id).sort()).toEqual([
            "q-newer-ask",
            "q-unanswered",
        ]);
    });

    it("still matches a single keyword in the title or text", async () => {
        const result = await filterQuestionsBySearch(questions, "website");

        expect(result.map((q) => q._id)).toEqual(["q-newer-ask"]);
    });

    it("matches a bracketed tag name", async () => {
        const result = await filterQuestionsBySearch(questions, "[android]");

        expect(result.map((q) => q._id)).toEqual(["q-older"]);
    });

    it("returns every question for an empty search", async () => {
        const result = await filterQuestionsBySearch(questions, "");

        expect(result).toHaveLength(3);
    });

    it("matches several tags and a keyword together", async () => {
        const result = await filterQuestionsBySearch(
            questions,
            "website [android] [react]"
        );

        expect(result.map((q) => q._id).sort()).toEqual([
            "q-newer-ask",
            "q-older",
        ]);
    });
});

describe("getQuestionsByOrder newest and unanswered", () => {
    it("returns only unanswered questions, newest first", async () => {
        mockFind([answeredOlder, unanswered, answeredNewerAsk]);

        const result = await getQuestionsByOrder("unanswered");

        expect(result.map((q) => q._id)).toEqual(["q-unanswered"]);
    });

    it("sorts every question by ask date, newest first", async () => {
        mockFind([answeredOlder, answeredNewerAsk, unanswered]);

        const result = await getQuestionsByOrder("newest");

        expect(result.map((q) => q._id)).toEqual([
            "q-unanswered",
            "q-newer-ask",
            "q-older",
        ]);
    });
});

describe("getQuestionsByOrder votes", () => {
    it("sorts by vote score, then by newest ask date", async () => {
        mockFind([
            { ...answeredOlder, upvote: ["a"], downvote: ["b", "c"] },
            { ...answeredNewerAsk, upvote: ["a", "b"], downvote: [] },
            { ...unanswered, upvote: ["a", "b"], downvote: [] },
        ]);

        const result = await getQuestionsByOrder("votes");

        expect(result.map((q) => q._id)).toEqual([
            "q-unanswered",
            "q-newer-ask",
            "q-older",
        ]);
    });
});

describe("addTag", () => {
    it("returns the existing tag id", async () => {
        Tag.findOne.mockResolvedValueOnce({
            _id: "507f191e810c19729de860ea",
            name: "react",
        });

        const result = await addTag("react");

        expect(String(result)).toEqual("507f191e810c19729de860ea");
        expect(Tag.findOne).toHaveBeenCalledWith({ name: "react" });
        expect(Tag.create).not.toHaveBeenCalled();
    });

    it("creates a tag when the name is new", async () => {
        Tag.findOne.mockResolvedValueOnce(null);
        Tag.create.mockResolvedValueOnce({
            _id: "65e9a5c2b26199dbcc3e6dc8",
            save: jest.fn().mockResolvedValue({ _id: "65e9a5c2b26199dbcc3e6dc8" }),
        });

        const result = await addTag("javascript");

        expect(Tag.create).toHaveBeenCalledWith({ name: "javascript" });
        expect(String(result)).toEqual("65e9a5c2b26199dbcc3e6dc8");
    });
});
