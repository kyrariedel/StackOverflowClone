import Question from "../../src/components/main/questionPage/question";
import QuestionHeader from "../../src/components/main/questionPage/header";

const noop = () => {};

const question = (overrides) => ({
    _id: "q1",
    title: "A question",
    tags: [],
    answers: [],
    comments: [],
    views: 12,
    upvote: ["a"],
    downvote: [],
    asked_by: "kyra",
    ask_date_time: "2024-01-01T00:00:00.000Z",
    ...overrides,
});

const channels = (color) => color.match(/\d+/g).slice(0, 3).map(Number);

describe("question list stats", () => {
    it("outlines answered questions in green and fills accepted ones", () => {
        const open = cy.stub().as("open");
        cy.mount(
            <>
                <Question q={question({ answers: [{ _id: "a1" }, { _id: "a2" }] })} clickTag={noop} handleAnswer={open} handleComment={noop} handleProfile={noop} />
                <Question q={question({ _id: "q2", title: "Accepted", answers: [{ _id: "a1" }], accepted_answer: "a1" })} clickTag={noop} handleAnswer={open} handleComment={noop} handleProfile={noop} />
                <Question q={question({ _id: "q3", title: "None" })} clickTag={noop} handleAnswer={open} handleComment={noop} handleProfile={noop} />
            </>
        );

        cy.contains("2 answers")
            .should("have.class", "has_answers")
            .and("have.css", "color", "rgb(47, 125, 50)")
            .and("have.css", "border-top-style", "solid")
            .and("have.css", "background-color", "rgba(0, 0, 0, 0)");
        cy.contains("✓ 1 answers")
            .should("have.class", "accepted")
            .and("have.css", "color", "rgb(255, 255, 255)")
            .and("have.css", "background-color", "rgb(47, 125, 50)");
        cy.contains("0 answers").should("not.have.class", "has_answers");
        cy.get(".vote_score").first().should("have.text", "1 votes");

        cy.contains("2 answers").click();
        cy.get("@open").should("not.have.been.called");
    });

    it("turns view counts from dark yellow toward red after 1000 views", () => {
        cy.mount(
            <>
                <Question q={question({ views: 1000, title: "Quiet" })} clickTag={noop} handleAnswer={noop} handleComment={noop} handleProfile={noop} />
                <Question q={question({ views: 1500, title: "Warm" })} clickTag={noop} handleAnswer={noop} handleComment={noop} handleProfile={noop} />
                <Question q={question({ views: 200000, title: "Hot" })} clickTag={noop} handleAnswer={noop} handleComment={noop} handleProfile={noop} />
            </>
        );

        cy.contains("1000 views").should("have.css", "color", "rgb(187, 187, 187)");
        cy.contains("1500 views").invoke("css", "color").then((warm) => {
            cy.contains("200000 views").invoke("css", "color").then((hot) => {
                const [, warmGreen] = channels(warm);
                const [hotRed, hotGreen] = channels(hot);
                const [warmRed] = channels(warm);
                expect(warmGreen).to.be.greaterThan(warmRed * 0.5);
                expect(hotRed).to.be.greaterThan(hotGreen * 3);
                expect(hotGreen).to.be.lessThan(warmGreen);
            });
        });
    });
});

describe("question sort", () => {
    it("selects score from the segmented control", () => {
        const setQuestionOrder = cy.stub().as("order");
        cy.mount(
            <QuestionHeader
                title_text="All Questions"
                qcnt={1}
                order="newest"
                setQuestionOrder={setQuestionOrder}
                handleNewQuestion={noop}
                account=""
            />
        );

        cy.get(".ant-segmented").contains("Score").click();
        cy.get("@order").should("have.been.calledWith", "score");
    });
});
