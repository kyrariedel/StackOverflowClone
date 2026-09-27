import Avatar from "../../baseComponents/avatar";
import MarkdownView from "../../baseComponents/markdown/MarkdownView";
import "./index.css";

// Component for the Answer Page
const Answer = ({ text, ansBy, meta, accepted, canAccept, onAccept, handleProfile, tags }) => {
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
                <MarkdownView text={text} tags={tags} />
            </div>
            <div className="answerAuthor">
                <button
                    className="answer_author author_link"
                    onClick={() => handleProfile && handleProfile(ansBy)}
                >
                    <Avatar username={ansBy} size={32} />
                    {ansBy}
                </button>
                <div className="answer_question_meta">{meta}</div>
                
            </div>
        </div>
    );
};

export default Answer;
