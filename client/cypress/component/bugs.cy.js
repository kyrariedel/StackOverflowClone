import React, { useState } from "react";
import QuestionHeader from "../../src/components/main/questionPage/header";
import AnswerHeader from "../../src/components/main/answerPage/header";
import AnswerPage from "../../src/components/main/answerPage";
import Header from "../../src/components/header";
import QuestionBody from "../../src/components/main/answerPage/questionBody";

const noop = () => {};

describe("fixed: question list login username", () => {
    it("treats the logged-in username as a string", () => {
        const ask = cy.stub().as("ask");

        cy.mount(
            <QuestionHeader
                title_text="All Questions"
                qcnt={1}
                setQuestionOrder={noop}
                handleNewQuestion={ask}
                account="kyra123"
            />
        );

        cy.contains("button", "Ask a Question").click();
        cy.get("@ask").should("have.been.calledOnce");
    });
});

describe("current bug: answer header counts and vote score", () => {
    it("labels answer and comment counts in that order", () => {
        cy.mount(
            <AnswerHeader
                ansCount={2}
                comCount={3}
                title="A question"
                handleNewQuestion={noop}
                account="kyra123"
                qid="q1"
                voteup={1}
                votedown={0}
            />
        );

        cy.get("#answersHeader").should("contain", "2 answer(s), 3 comment(s)");
    });

    it("shows a zero score before vote counts load", () => {
        cy.mount(
            <AnswerHeader
                ansCount={0}
                comCount={0}
                title="A question"
                handleNewQuestion={noop}
                account=""
                qid="q1"
            />
        );

        cy.get(".number").should("have.text", "0");
    });
});

describe("current bug: vote score stays stale after voting", () => {
    it("shows the score returned by the vote request", () => {
        cy.intercept("GET", "**/question/getQuestionById/*", {
            statusCode: 200,
            body: {
                title: "A question",
                text: "Body",
                answers: [],
                comments: [],
                upvote: ["someone"],
                downvote: [],
                views: 3,
                asked_by: "kyra",
                ask_date_time: "2024-01-01T00:00:00.000Z",
            },
        }).as("question");

        cy.intercept("GET", "**/question/upvoteQuestion*", {
            statusCode: 200,
            body: {
                upvote: ["someone", "kyra123"],
                downvote: [],
            },
        }).as("vote");

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

        cy.wait("@question");
        cy.get(".number").should("have.text", "1");
        cy.get(".upvote").click();
        cy.wait("@vote");
        cy.get(".number").should("have.text", "2");
    });
});

describe("current bug: extra comment button", () => {
    it("offers one question comment button when the question has no answers", () => {
        cy.intercept("GET", "**/question/getQuestionById/*", {
            statusCode: 200,
            body: {
                title: "A question",
                text: "Body",
                answers: [],
                comments: [],
                upvote: [],
                downvote: [],
                views: 1,
                asked_by: "kyra",
                ask_date_time: "2024-01-01T00:00:00.000Z",
            },
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

        cy.get("button.replyBtn").should("have.length", 1);
    });
});

describe("current bug: search box ignores a new search from a tag", () => {
    it("shows the search value passed in after the first render", () => {
        function Harness() {
            const [search, setSearch] = useState("");
            return (
                <>
                    <button id="apply-tag" onClick={() => setSearch("[react]")}>
                        Apply tag
                    </button>
                    <Header search={search} setQuestionPage={noop} />
                </>
            );
        }

        cy.mount(<Harness />);
        cy.get("#apply-tag").click();
        cy.get("#searchBar").should("have.value", "[react]");
    });
});

describe("current bug: question text is inserted as HTML", () => {
    it("does not render markup stored in the question text", () => {
        cy.mount(
            <QuestionBody
                views={1}
                text={'hello <img class="injected" src="x" />'}
                askby="kyra"
                meta="just now"
            />
        );

        cy.get(".answer_question_text").should("contain", "hello");
        cy.get(".answer_question_text img.injected").should("not.exist");
    });
});
