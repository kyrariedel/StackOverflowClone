import { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import Comment from "./comment"
import "./index.css";
import QuestionBody from "./questionBody";
import { getQuestionById } from "../../../services/questionService";
//import { getCommentById } from "../../../services/commentService";

// Component for the Answers page
const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, handleNewComment, handleSignup, handleLogin, handleLogout, account }) => {
    const [question, setQuestion] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            let res = await getQuestionById(qid);
            setQuestion(res || {});
        };
        fetchData().catch((e) => console.log(e));
    }, [qid]);


    return (
        <>
            <div id="login" className="header_button">
                <button
                    className="bluebtn_login"
                    id="signupbtn"
                    onClick={() => {
                        handleSignup();
                    }}> 
                        Signup
                </button>
                <button
                    className="bluebtn_login"
                    id="loginbtn"
                    onClick={() => {
                        if (account) {
                            alert(`You are logged in as ${account}`)
                        } else {
                            handleLogin();
                        }
                    }}> 
                        Login
                </button>
                <button
                    className="bluebtn_login"
                    id="logoutbtn"
                    onClick={() => {
                        handleLogout();
                    }}> 
                        Logout
                </button>
            </div>
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
                voteup={question && question.upvote && question.upvote.length }
                votedown={question && question.downvote && question.downvote.length}
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
            />
            <button
                className="replyBtn"
                onClick={() => {
                    if (account) {
                        handleNewComment();
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
                    />
                ))}

            {question &&
                question.answers &&
                question.answers.map((a, idx) => (
                    <div key={idx}>
                        <Answer
                            text={a.text}
                            ansBy={a.ans_by}
                            meta={getMetaData(new Date(a.ans_date_time))}
                        />
                        {a.comments && a.comments.length > 0 && (
                            <div>
                                {a.comments.map((comment, commentIdx) => (
                                    <Comment
                                        key = {commentIdx}
                                        text = {comment.text}
                                        comBy = {comment.com_by}
                                        meta = {getMetaData(new Date(comment.com_date_time))}
                                    />
                                ))}
                            </div>
                        )}
                        <button
                            className="replyBtn"
                            onClick={() => {
                                if (account) {
                                    handleNewComment(a._id);
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
                        handleNewAnswer();
                    } else {
                        alert("Please log in to answer a question");
                    }
                }}
            >
                Answer Question
            </button>

                <button
                className="replyBtn"
                onClick={() => {
                    if (account) {
                        handleNewComment();
                    } else {
                        alert("Please log in to reply to an answer");
                    }
                }}
            >
                Add a Comment
            </button>
        </>
    );
};

export default AnswerPage