import "./index.css";
import React from "react";
import Avatar from "../../baseComponents/avatar";
import MarkdownView from "../../baseComponents/markdown/MarkdownView";

// Component for the Question's Body
const QuestionBody = ({ views, text, askby, meta, handleProfile, tags }) => {
    return (
        <div id="questionBody" className="questionBody right_padding">
            <div className="bold_title answer_question_view">{views} views</div>
            <div className="answer_question_text">
                <MarkdownView text={text} tags={tags} />
            </div>
            <div className="answer_question_right">
                <button
                    className="question_author author_link"
                    onClick={() => handleProfile && handleProfile(askby)}
                >
                    <Avatar username={askby} size={36} />
                    {askby}
                </button>
                <div className="answer_question_meta">asked {meta}</div>
            </div>  
        </div>
    );
};

export default QuestionBody;
