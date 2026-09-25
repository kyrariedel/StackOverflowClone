import { handleHyperlink } from "../../../../tool";
import "./index.css";

// Component for the Answer Page
const Answer = ({ text, ansBy, meta, accepted, canAccept, onAccept }) => {
    return (
        <div className={`answer right_padding ${accepted ? "answer_accepted" : ""}`}>
            <div className="answer_accept">
                {canAccept && (
                    <button
                        className={`acceptBtn ${accepted ? "acceptBtn_on" : ""}`}
                        onClick={onAccept}
                    >
                        {accepted ? "Accepted" : "Accept"}
                    </button>
                )}
                {!canAccept && accepted && (
                    <div className="accepted_label">Accepted</div>
                )}
            </div>
            <div id="answerText" className="answerText">
                {handleHyperlink(text)}
            </div>
            <div className="answerAuthor">
                <div className="answer_author">{ansBy}</div>
                <div className="answer_question_meta">{meta}</div>
                
            </div>
        </div>
    );
};

export default Answer;
