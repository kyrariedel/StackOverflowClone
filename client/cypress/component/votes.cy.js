import React from "react";
import AnswerPage from "../../src/components/main/answerPage";

const noop = () => {};

const question = {
    title: "How do I pin an accepted answer?",
    text: "Body",
    asked_by: "kyra123",
    views: 1,
    ask_date_time: "2024-01-01T00:00:00.000Z",
    comments: [],
    upvote: ["a", "b"],
    downvote: ["c"],
    accepted_answer: "a-old",
    answers: [
        {
            _id: "a-new",
            text: "This answer should sit below.",
            ans_by: "saltyPeter",
            ans_date_time: "2024-01-02T00:00:00.000Z",
            comments: [],
        },
        {
            _id: "a-old",
            text: "This answer should be pinned.",
            ans_by: "elephantCDE",
            ans_date_time: "2024-01-01T00:00:00.000Z",
            comments: [],
        },
    ],
};

describe("votes and accepted answers", () => {
    it("pins the accepted answer above the others", () => {
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
                handleSignup={noop}
                handleLogin={noop}
                handleLogout={noop}
                account="kyra123"
            />
        );

        cy.get(".answer").first().should("contain", "This answer should be pinned.");
        cy.get(".answer").first().find(".acceptBtn_on").should("contain", "Accepted");
        cy.get(".answer").last().should("contain", "This answer should sit below.");
    });

    it("moves the newly accepted answer to the top", () => {
        cy.intercept("GET", "**/question/getQuestionById/*", {
            statusCode: 200,
            body: question,
        });
        cy.intercept("POST", "**/answer/acceptAnswer", {
            statusCode: 200,
            body: { accepted_answer: "a-new" },
        }).as("accept");

        cy.mount(
            <AnswerPage
                qid="q1"
                handleNewQuestion={noop}
                handleNewAnswer={noop}
                handleNewComment={noop}
                handleSignup={noop}
                handleLogin={noop}
                handleLogout={noop}
                account="kyra123"
            />
        );

        cy.get(".answer").last().contains("Accept").click();
        cy.wait("@accept");
        cy.get(".answer").first().should("contain", "This answer should sit below.");
        cy.get(".answer").first().find(".acceptBtn_on").should("contain", "Accepted");
    });

    it("updates an answer score and a comment score", () => {
        cy.intercept("GET", "**/question/getQuestionById/*", {
            statusCode: 200,
            body: {
                ...question,
                comments: [
                    {
                        _id: "c-q",
                        text: "A question comment",
                        com_by: "kyra123",
                        com_date_time: "2024-01-03T00:00:00.000Z",
                        upvote: [],
                    },
                ],
                answers: [
                    {
                        ...question.answers[1],
                        upvote: ["a"],
                        downvote: ["b"],
                        comments: [
                            {
                                _id: "c-a",
                                text: "A note on the answer",
                                com_by: "saltyPeter",
                                com_date_time: "2024-01-04T00:00:00.000Z",
                                upvote: ["x", "y"],
                            },
                        ],
                    },
                    question.answers[0],
                ],
            },
        });
        cy.intercept("GET", "**/answer/upvoteAnswer*", {
            statusCode: 200,
            body: {
                _id: "a-old",
                upvote: ["a", "kyra123"],
                downvote: [],
            },
        }).as("answerVote");
        cy.intercept("GET", "**/comment/upvoteComment*", {
            statusCode: 200,
            body: {
                _id: "c-q",
                upvote: ["kyra123"],
            },
        }).as("commentVote");

        cy.mount(
            <AnswerPage
                qid="q1"
                handleNewQuestion={noop}
                handleNewAnswer={noop}
                handleNewComment={noop}
                handleSignup={noop}
                handleLogin={noop}
                handleLogout={noop}
                account="kyra123"
            />
        );

        cy.contains(".answer", "This answer should be pinned.").find(".number").should("have.text", "0");
        cy.contains(".answer", "This answer should be pinned.").find(".upvote").click();
        cy.wait("@answerVote");
        cy.contains(".answer", "This answer should be pinned.").find(".number").should("have.text", "2");
        cy.contains(".answer", "This answer should be pinned.").find(".timeline_btn").should("exist");
        cy.contains(".answer", "This answer should be pinned.").find(".downvote").should("exist");

        cy.contains(".comment", "A question comment").find(".number").should("have.text", "0");
        cy.contains(".comment", "A question comment").find(".downvote").should("not.exist");
        cy.contains(".comment", "A question comment").find(".timeline_btn").should("not.exist");
        cy.contains(".comment", "A question comment").find(".upvote").click();
        cy.wait("@commentVote");
        cy.contains(".comment", "A question comment").find(".number").should("have.text", "1");

        cy.contains(".comment", "A note on the answer").find(".number").should("have.text", "2");
        cy.contains(".comment", "A note on the answer").find(".downvote").should("not.exist");
        cy.contains(".comment", "A note on the answer").find(".timeline_btn").should("not.exist");
    });
});
