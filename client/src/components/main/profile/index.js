import { useEffect, useState } from "react";
import { getProfile } from "../../../services/accountService";
import Avatar from "../baseComponents/avatar";
import AuthButtons from "../baseComponents/authButtons";
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
            <AuthButtons
                account={account}
                handleSignup={handleSignup}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
            {profile && (
                <div className="profile_page right_padding">
                    <div className="profile_heading">
                        <Avatar username={profile.username} size={80} />
                        <div>
                            <div className="bold_title">{profile.name}</div>
                            <div className="profile_username">{profile.username}</div>
                        </div>
                    </div>
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
