import { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import Comment from "./comment"
import "./index.css";
import QuestionBody from "./questionBody";
import { getQuestionById } from "../../../services/questionService";
import { acceptAnswer } from "../../../services/answerService";
//import { getCommentById } from "../../../services/commentService";

// Component for the Answers page
const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, handleNewComment, handleProfile, account }) => {
    const [question, setQuestion] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            let res = await getQuestionById(qid);
            setQuestion(res || {});
        };
        fetchData().catch((e) => console.log(e));
    }, [qid]);

    const applyVote = (updated) => {
        setQuestion((current) => ({
            ...current,
            upvote: updated.upvote || [],
            downvote: updated.downvote || [],
        }));
    };

    const handleAccept = async (aid) => {
        const res = await acceptAnswer(qid, aid, account);
        if (res && !res.error) {
            setQuestion((current) => ({
                ...current,
                accepted_answer: res.accepted_answer,
            }));
        }
    };

    const answers = [...((question && question.answers) || [])].sort((a, b) => {
        const acceptedId = question.accepted_answer && String(question.accepted_answer);
        const aAccepted = String(a._id) === acceptedId;
        const bAccepted = String(b._id) === acceptedId;
        if (aAccepted === bAccepted) return 0;
        return aAccepted ? -1 : 1;
    });
    const isAuthor = Boolean(account) && account === question.asked_by;


    return (
        <>
            <AnswerHeader
                comCount={
                    question && question.comments && question.comments.length
                }
                ansCount={
                    question && question.answers && question.answers.length
                }
                title={question && question.title}
                handleNewQuestion={handleNewQuestion}
                account={account}
                qid={qid}
                voteup={question && question.upvote ? question.upvote.length : 0}
                votedown={question && question.downvote ? question.downvote.length : 0}
                onVoted={applyVote}
                views={question && question.views}
                text={question && question.text}
                askby={question && question.asked_by}
                meta={question && getMetaData(new Date(question.ask_date_time))}
            />
            <QuestionBody
                views={question && question.views}
                text={question && question.text}
                askby={question && question.asked_by}
                meta={question && getMetaData(new Date(question.ask_date_time))}
                handleProfile={handleProfile}
                tags={question && question.tags}
            />
            <button
                className="replyBtn"
                onClick={() => {
                    if (account) {
                        handleNewComment(null, question.tags);
                    } else {
                        alert("Please log in to reply to a question");
                    }
                }}
            >
                Add a Comment
            </button>
            {question &&
                question.comments &&
                question.comments.map((c, idx) => (
                    <Comment
                        key={idx}
                        text={c.text}
                        comBy={c.com_by}
                        meta={getMetaData(new Date(c.com_date_time))}
                        tags={question.tags}
                    />
                ))}

            {answers.map((a) => (
                    <div key={a._id}>
                        <Answer
                            text={a.text}
                            ansBy={a.ans_by}
                            meta={getMetaData(new Date(a.ans_date_time))}
                            accepted={String(a._id) === String(question.accepted_answer || "")}
                            canAccept={isAuthor}
                            onAccept={() => handleAccept(a._id)}
                            handleProfile={handleProfile}
                            tags={question.tags}
                        />
                        {a.comments && a.comments.length > 0 && (
                            <div>
                                {a.comments.map((comment, commentIdx) => (
                                    <Comment
                                        key = {commentIdx}
                                        text = {comment.text}
                                        comBy = {comment.com_by}
                                        meta = {getMetaData(new Date(comment.com_date_time))}
                                        tags={question.tags}
                                    />
                                ))}
                            </div>
                        )}
                        <button
                            className="replyBtn"
                            onClick={() => {
                                if (account) {
                                    handleNewComment(a._id, question.tags);
                                } else {
                                    alert("Please log in to reply to an answer");
                                }
                            }}
                        >
                            Add a Comment
                        </button> 
                        </div> ))}
            <button
                className="bluebtn ansButton"
                onClick={() => {
                    if (account) {
                        handleNewAnswer(question.tags);
                    } else {
                        alert("Please log in to answer a question");
                    }
                }}
            >
                Answer Question
            </button>
        </>
    );
};

export default AnswerPage