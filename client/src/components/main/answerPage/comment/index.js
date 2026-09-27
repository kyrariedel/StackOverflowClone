import { handleHyperlink } from "../../../../tool";
import Avatar from "../../baseComponents/avatar";
import "./index.css";

// Component for the Comment Page
const Comment = ({ text, comBy, meta }) => {
    return (
        <div className="comment right_padding">
            <div id="commentText" className="commentText">
                {handleHyperlink(text)}
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