import "./index.css";
import { upvoteQuestion } from "../../../../services/questionService";
import { downvoteQuestion } from "../../../../services/questionService";

// Header for the Answer page
const AnswerHeader = ({ comCount, ansCount, title, handleNewQuestion, account, qid, voteup, votedown }) => {
    const upvote = async () => {
        if (account) {
            await upvoteQuestion(account, qid);
        } else {
            alert("Please log in to vote");
        }
    }

    const downvote = async () => {
        if (account) {
            await downvoteQuestion(account, qid);
        } else {
            alert("Please log in to vote");
        }
    }
    return (
        <div>
            <div id="answersHeader" className="space_between right_padding">
                <div className="bold_title">{ansCount} comment(s), {comCount} answer(s)</div>
                <div className="bold_title answer_question_title">{title}</div>
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
                    onClick={() => {
                        upvote();
                    }}>
                </button>
                <div className="number">
                    {voteup-votedown}
                </div>
                <button
                    className="downvote"
                    onClick={() => {
                        downvote();
                    }}>
                </button>
            </div>
        </div>
    );
};

export default AnswerHeader;
