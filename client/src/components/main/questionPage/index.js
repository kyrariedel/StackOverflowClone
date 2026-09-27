import "./index.css";
import QuestionHeader from "./header";
import Question from "./question";

import { getQuestionsByFilter } from "../../../services/questionService";
import { useEffect, useState } from "react";

const PAGE_SIZE = 3;

const QuestionPage = ({
    title_text = "All Questions",
    order,
    search,
    setQuestionOrder,
    clickTag,
    handleAnswer,
    handleComment,
    handleNewQuestion,
    handleSignup,
    handleLogin, 
    handleLogout,
    handleProfile,
    account,
}) => {
    const [qlist, setQlist] = useState([]);
    const [page, setPage] = useState(1);
    useEffect(() => {
        const fetchData = async () => {
            let res = await getQuestionsByFilter(order, search);
            setQlist(res || []);
            setPage(1);
        };

        fetchData().catch((e) => console.log(e));
    }, [order, search]);
    const pageCount = Math.max(1, Math.ceil(qlist.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const visible = qlist.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    return (
        <>
            <QuestionHeader
                title_text={title_text}
                qcnt={qlist.length}
                setQuestionOrder={setQuestionOrder}
                handleNewQuestion={handleNewQuestion}
                handleSignup={handleSignup}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
                account={account}
            />
            <div id="question_list" className="question_list">
                {visible.map((q, idx) => (
                    <Question
                        q={q}
                        key={idx}
                        search={search}
                        clickTag={clickTag}
                        handleAnswer={handleAnswer}
                        handleComment={handleComment}
                        handleProfile={handleProfile}
                    />
                ))}
            </div>
            {qlist.length > PAGE_SIZE && (
                <div className="pager">
                    <button
                        id="page_prev"
                        className="btn"
                        disabled={currentPage === 1}
                        onClick={() => setPage(currentPage - 1)}
                    >
                        Prev
                    </button>
                    {Array.from({ length: pageCount }, (_, index) => (
                        <button
                            key={index}
                            className={`btn ${currentPage === index + 1 ? "page_current" : ""}`}
                            onClick={() => setPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        id="page_next"
                        className="btn"
                        disabled={currentPage === pageCount}
                        onClick={() => setPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
            {title_text === "Search Results" && !qlist.length && (
                <div className="bold_title right_padding">
                    No Questions Found
                </div>
            )}
        </>
    );
};

export default QuestionPage;
