import { getMetaData } from "../../../../tool";
import "./index.css";

const voteScore = (q) =>
    (q.upvote || []).length - (q.downvote || []).length;

const searchKeywords = (search = "") =>
    (search.replace(/\[[^\]]*\]/g, " ").match(/\b\w+\b/g) || []);

const highlightTitle = (title = "", search = "") => {
    const keywords = searchKeywords(search).filter((keyword) =>
        title.toLowerCase().includes(keyword.toLowerCase())
    );
    if (!keywords.length) {
        return title;
    }

    const pattern = new RegExp(
        `(${keywords.map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
        "gi"
    );
    return title.split(pattern).map((part, index) =>
        keywords.some((keyword) => keyword.toLowerCase() === part.toLowerCase()) ? (
            <mark key={index} className="search_hit">{part}</mark>
        ) : (
            part
        )
    );
};

const Question = ({ q, clickTag, handleAnswer, handleComment, handleProfile, search }) => {
    return (
        <div
            className="question right_padding"
            onClick={() => {
                handleAnswer(q._id);
                handleComment(q._id);
            }}
        >
            <div className="postStats">
                <div className="vote_score">{voteScore(q)} votes</div>
                <div>{q.answers.length || 0} answers</div>
                <div>{q.comments.length || 0} comments</div>
                <div>{q.views} views</div>
            </div>
            <div className="question_mid">
                <div className="postTitle">{highlightTitle(q.title, search)}</div>
                <div className="question_tags">
                    {q.tags.map((tag, idx) => {
                        return (
                            <button
                                key={idx}
                                className="question_tag_button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clickTag(tag.name);
                                }}
                            >
                                {tag.name}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="lastActivity">
                <button
                    className="question_author author_link"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleProfile(q.asked_by);
                    }}
                >
                    {q.asked_by}
                </button>
                <div>&nbsp;</div>
                <div className="question_meta">
                    asked {getMetaData(new Date(q.ask_date_time))}
                </div>
            </div>
        </div>
    );
};

export default Question;
