import { useEffect, useState } from "react";
import { getProfile } from "../../../services/accountService";
import "./index.css";

const ProfilePage = ({
    username,
    handleAnswer,
    handleSignup,
    handleLogin,
    handleLogout,
    account,
}) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getProfile(username);
            setProfile(res || null);
        };

        fetchData().catch((e) => console.log(e));
    }, [username]);

    return (
        <>
            <div id="login" className="header_button">
                <button className="bluebtn_login" id="signupbtn" onClick={handleSignup}>
                    Signup
                </button>
                <button
                    className="bluebtn_login"
                    id="loginbtn"
                    onClick={() => {
                        if (account) {
                            alert(`You are logged in as ${account}`);
                        } else {
                            handleLogin();
                        }
                    }}
                >
                    Login
                </button>
                <button className="bluebtn_login" id="logoutbtn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            {profile && (
                <div className="profile_page right_padding">
                    <div className="bold_title">{profile.name}</div>
                    <div className="profile_username">{profile.username}</div>
                    <div id="reputation" className="profile_reputation">
                        {profile.reputation} reputation
                    </div>
                    <div className="bold_title profile_section">Questions</div>
                    {profile.questions.length === 0 && <div>No questions yet</div>}
                    {profile.questions.map((question) => (
                        <button
                            key={question._id}
                            className="profile_post"
                            onClick={() => handleAnswer(question._id)}
                        >
                            <span>{question.title}</span>
                            <span>{question.score} votes</span>
                        </button>
                    ))}
                    <div className="bold_title profile_section">Answers</div>
                    {profile.answers.length === 0 && <div>No answers yet</div>}
                    {profile.answers.map((answer) => (
                        <button
                            key={answer._id}
                            className="profile_post"
                            onClick={() => answer.questionId && handleAnswer(answer.questionId)}
                        >
                            <span>{answer.text}</span>
                            <span>
                                {answer.score} votes
                                {answer.questionTitle ? ` on ${answer.questionTitle}` : ""}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

export default ProfilePage;
