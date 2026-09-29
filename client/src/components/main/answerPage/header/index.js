import "./index.css";
import { CaretDownOutlined, CaretUpOutlined, HistoryOutlined } from "@ant-design/icons";
import { upvoteQuestion } from "../../../../services/questionService";
import { downvoteQuestion } from "../../../../services/questionService";

// Header for the Answer page
const AnswerHeader = ({ comCount, ansCount, title, handleNewQuestion, account, qid, voteup, votedown, onVoted, showTimeline, onTimeline }) => {
    const applyVote = (updated) => {
        if (onVoted && updated) {
            onVoted(updated);
        }
    };

    const upvote = async () => {
        if (account) {
            applyVote(await upvoteQuestion(account, qid));
        } else {
            alert("Please log in to vote");
        }
    }

    const downvote = async () => {
        if (account) {
            applyVote(await downvoteQuestion(account, qid));
        } else {
            alert("Please log in to vote");
        }
    }
    return (
        <div>
            <div id="answersHeader" className="answer_header right_padding">
                <div className="answer_header_titles">
                    <div className="bold_title answer_question_title">{title}</div>
                    <div className="answer_counts">{ansCount} answer(s), {comCount} comment(s)</div>
                </div>
                <button
                    className="bluebtn"
                    onClick={() => {
                        if (account) {
                            handleNewQuestion();
                        } else {
                            alert("Please log in to answer a question");
                        }
                    }}
                >
                    Ask a Question
                </button>
            </div>
            <div className="voting">
                <button
                    className="upvote"
                    aria-label="Upvote"
                    onClick={() => {
                        upvote();
                    }}>
                    <CaretUpOutlined />
                </button>
                <div className="number">
                    {(Number(voteup) || 0) - (Number(votedown) || 0)}
                </div>
                <button
                    className="downvote"
                    aria-label="Downvote"
                    onClick={() => {
                        downvote();
                    }}>
                    <CaretDownOutlined />
                </button>
                <button
                    id="timeline_btn"
                    type="button"
                    className="timeline_btn"
                    aria-label={showTimeline ? "Hide timeline" : "Show timeline"}
                    onClick={onTimeline}
                >
                    <HistoryOutlined />
                </button>
            </div>
        </div>
    );
};

export default AnswerHeader;
