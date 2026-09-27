import "./index.css";
import { Segmented } from "antd";

const SORTS = [
    { label: "Newest", value: "newest" },
    { label: "Active", value: "active" },
    { label: "Unanswered", value: "unanswered" },
    { label: "Score", value: "score" },
];

const QuestionHeader = ({
    title_text,
    qcnt,
    order,
    setQuestionOrder,
    handleNewQuestion,
    account,
}) => {
    return (
        <div>
            <div className="space_between right_padding">
                <div className="bold_title">{title_text}</div>
                <button
                    className="bluebtn"
                    onClick={() => {
                        if (account) {
                            handleNewQuestion();
                        } else {
                            alert("Please log in to ask a question");
                        }
                    }}
                >
                    Ask a Question
                </button>
            </div>
            <div className="space_between right_padding">
                <div id="question_count">{qcnt} questions</div>
                <Segmented
                    className="order_segment"
                    options={SORTS}
                    value={order || "newest"}
                    onChange={setQuestionOrder}
                />
            </div>
        </div>
    );
};

export default QuestionHeader;
