import "./index.css";
import OrderButton from "./orderButton";
import AuthButtons from "../../baseComponents/authButtons";

const QuestionHeader = ({
    title_text,
    qcnt,
    setQuestionOrder,
    handleNewQuestion,
    handleSignup,
    handleLogin,
    handleLogout, 
    account,
}) => {
    return (
        <div>
            <AuthButtons
                account={account}
                handleSignup={handleSignup}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
            <div className="header_buffer">
                &nbsp;
            </div>
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
                <div className="btns">
                    {["Newest", "Active", "Unanswered", "Votes"].map((m, idx) => (
                        <OrderButton
                            key={idx}
                            message={m}
                            setQuestionOrder={setQuestionOrder}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionHeader;
