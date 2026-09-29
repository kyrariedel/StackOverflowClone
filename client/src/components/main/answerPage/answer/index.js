import { CaretDownOutlined, CaretUpOutlined, HistoryOutlined } from "@ant-design/icons";
import Avatar from "../../baseComponents/avatar";
import MarkdownView from "../../baseComponents/markdown/MarkdownView";
import "./index.css";

// Component for the Answer Page
const Answer = ({ text, ansBy, meta, accepted, canAccept, onAccept, handleProfile, tags, voteup, votedown, onUpvote, onDownvote, onTimeline }) => {
    return (
        <div className={`answer right_padding ${accepted ? "answer_accepted" : ""}`}>
            <div className="voting">
                <button
                    className="upvote"
                    aria-label="Upvote"
                    onClick={onUpvote}
                >
                    <CaretUpOutlined />
                </button>
                <div className="number">
                    {(Number(voteup) || 0) - (Number(votedown) || 0)}
                </div>
                <button
                    className="downvote"
                    aria-label="Downvote"
                    onClick={onDownvote}
                >
                    <CaretDownOutlined />
                </button>
                <button
                    type="button"
                    className="timeline_btn"
                    aria-label="Show timeline"
                    onClick={onTimeline}
                >
                    <HistoryOutlined />
                </button>
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
