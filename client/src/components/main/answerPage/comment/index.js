import { CaretUpOutlined } from "@ant-design/icons";
import Avatar from "../../baseComponents/avatar";
import MarkdownView from "../../baseComponents/markdown/MarkdownView";
import "./index.css";

// Component for the Comment Page
const Comment = ({ text, comBy, meta, tags, score, onUpvote }) => {
    return (
        <div className="comment right_padding">
            <div className="comment_vote">
                <button
                    className="upvote"
                    aria-label="Upvote"
                    onClick={onUpvote}
                >
                    <CaretUpOutlined />
                </button>
                <div className="number">{Number(score) || 0}</div>
            </div>
            <div id="commentText" className="commentText">
                <MarkdownView text={text} tags={tags} />
            </div>
            <div className="commentAuthor">
                <div className="comment_author">
                    <Avatar username={comBy} size={24} />
                    {comBy}
                </div>
                <div className="comment_question_meta"> replied {meta}</div>
            </div>
        </div>
    );
};

export default Comment;