import { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import Comment from "./comment"
import "./index.css";
import QuestionBody from "./questionBody";
import Timeline from "./timeline";
import { getQuestionById } from "../../../services/questionService";
import { acceptAnswer, downvoteAnswer, upvoteAnswer } from "../../../services/answerService";
import { upvoteComment } from "../../../services/commentService";
//import { getCommentById } from "../../../services/commentService";

// Component for the Answers page
const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, handleNewComment, handleProfile, account }) => {
    const [question, setQuestion] = useState({});
    const [timelineId, setTimelineId] = useState(null);
    useEffect(() => {
        setTimelineId(null);
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

    const applyAnswerVote = (aid, updated) => {
        if (!updated || !updated._id) {
            return;
        }
        setQuestion((current) => ({
            ...current,
            answers: (current.answers || []).map((answer) =>
                String(answer._id) === String(aid)
                    ? {
                        ...answer,
                        upvote: updated.upvote || [],
                        downvote: updated.downvote || [],
                    }
                    : answer
            ),
        }));
    };

    const applyCommentVote = (cid, updated) => {
        if (!updated || !updated._id) {
            return;
        }
        const patch = (comment) =>
            String(comment._id) === String(cid)
                ? { ...comment, upvote: updated.upvote || [] }
                : comment;
        setQuestion((current) => ({
            ...current,
            comments: (current.comments || []).map(patch),
            answers: (current.answers || []).map((answer) => ({
                ...answer,
                comments: (answer.comments || []).map(patch),
            })),
        }));
    };

    const voteOnAnswer = async (aid, direction) => {
        if (!account) {
            alert("Please log in to vote");
            return;
        }
        const updated = direction === "down"
            ? await downvoteAnswer(account, aid)
            : await upvoteAnswer(account, aid);
        applyAnswerVote(aid, updated);
    };

    const voteOnComment = async (cid) => {
        if (!account) {
            alert("Please log in to vote");
            return;
        }
        applyCommentVote(cid, await upvoteComment(account, cid));
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
    const thread = (
        <>
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
                        score={c.upvote ? c.upvote.length : 0}
                        onUpvote={() => voteOnComment(c._id)}
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
                            voteup={a.upvote ? a.upvote.length : 0}
                            votedown={a.downvote ? a.downvote.length : 0}
                            onUpvote={() => voteOnAnswer(a._id, "up")}
                            onDownvote={() => voteOnAnswer(a._id, "down")}
                            onTimeline={() => setTimelineId(a._id)}
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
                                        score={comment.upvote ? comment.upvote.length : 0}
                                        onUpvote={() => voteOnComment(comment._id)}
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
                showTimeline={timelineId === "question"}
                onTimeline={() => setTimelineId((current) => current === "question" ? null : "question")}
            />
            {timelineId === "question" && (
                <Timeline
                    question={question}
                    handleProfile={handleProfile}
                    onOpenAnswer={(answerId) => setTimelineId(answerId)}
                />
            )}
            {timelineId && timelineId !== "question" && (
                <Timeline
                    question={question}
                    answer={(question.answers || []).find((answer) => String(answer._id) === String(timelineId))}
                    handleProfile={handleProfile}
                />
            )}
            {timelineId ? null : thread}
        </>
    );
};

export default AnswerPage