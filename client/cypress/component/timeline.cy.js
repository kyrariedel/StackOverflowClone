import AnswerPage from "../../src/components/main/answerPage";

const noop = () => {};

const question = {
    title: "How do I pin an answer?",
    text: "Body",
    asked_by: "reaper",
    ask_date_time: "2024-01-01T12:00:00.000Z",
    views: 3,
    upvote: [],
    downvote: [],
    comments: [
        {
            text: "You can override OnPaint.",
            com_by: "sergey",
            com_date_time: "2024-01-03T12:00:00.000Z",
        },
    ],
    answers: [
        {
            _id: "a1",
            text: "Call Draw from the handler.",
            ans_by: "olivier",
            ans_date_time: "2024-01-02T12:00:00.000Z",
            upvote: ["a", "b"],
            downvote: [],
            comments: [
                {
                    text: "That is simpler.",
                    com_by: "reaper",
                    com_date_time: "2024-01-04T12:00:00.000Z",
                },
            ],
        },
    ],
};

describe("question timeline", () => {
    it("shows the post timeline after the button is clicked", () => {
        cy.intercept("GET", "**/question/getQuestionById/*", {
            statusCode: 200,
            body: question,
        });

        cy.mount(
            <AnswerPage
                qid="q1"
                handleNewQuestion={noop}
                handleNewAnswer={noop}
                handleNewComment={noop}
                account=""
            />
        );

        cy.get(".downvote").should("be.visible");
        cy.get(".upvote").should("be.visible");
        cy.get("#timeline").should("not.exist");
        cy.get("#timeline_btn").should("have.attr", "aria-label", "Show timeline").click();
        cy.get("#timeline").should("contain", "Timeline for How do I pin an answer?");
        cy.get("#answersHeader .answer_counts").should("have.text", "1 answer(s), 1 comment(s)");
        cy.get("#timeline").should("contain", "4 events");
        cy.get("#timeline tbody tr").eq(0).should("contain", "comment").and("contain", "added").and("contain", "reaper").and("contain", "That is simpler.");
        cy.get("#timeline tbody tr").eq(0).find("a.timeline_link").should("have.text", "timeline").click();
        cy.get("#timeline").should("contain", "Timeline for answer by olivier");
        cy.get("#timeline").should("contain", "2 events");
        cy.get("#timeline").should("contain", "answered");
        cy.get("#timeline").should("contain", "That is simpler.");
        cy.get("#timeline").should("not.contain", "asked");
        cy.get("#timeline_btn").click();
        cy.get("#timeline").should("contain", "Timeline for How do I pin an answer?");
        cy.get("#timeline_btn").click();
        cy.get("#timeline").should("not.exist");
        cy.contains("Answer Question");
    });
});
