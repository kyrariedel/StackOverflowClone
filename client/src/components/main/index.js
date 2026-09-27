import "./index.css";
import { useEffect, useState } from "react";
import SideBarNav from "./sideBarNav";
import QuestionPage from "./questionPage";
import TagPage from "./tagPage";
import AnswerPage from "./answerPage";
import NewQuestion from "./newQuestion";
import NewAnswer from "./newAnswer";
import NewComment from "./newComment";
import Signup from "./account/signup";
import Login from "./account/login";
import ProfilePage from "./profile";

const Main = ({ search = "", title, setQuestionPage, account, setAccount, profileTick, onPageChange }) => {
    const [page, setPage] = useState("home");
    const [questionOrder, setQuestionOrder] = useState("newest");
    const [qid, setQid] = useState("");
    const [aid, setAid] = useState("");
    const [profileUser, setProfileUser] = useState("");
    let selected = "";
    let content = null;

    const handleQuestions = () => {
        setQuestionPage();
        setPage("home");
    };

    const handleNewLogin = (login) => {
        setQuestionPage();
        setAccount(login);
        setPage("home");
    }

    const handleTags = () => {
        setPage("tag");
    };

    const handleAnswer = (qid) => {
        setQid(qid);
        setPage("answer");
    };

    const handleComment = (qid, aid = null) => {
        setQid(qid);
        setAid(aid)
        setPage("comment");
    };

    const clickTag = (tname) => {
        setQuestionPage("[" + tname + "]", tname);
        setPage("home");
    };

    const handleNewQuestion = () => {
        setPage("newQuestion");
    };

    const handleNewAnswer = () => {
        setPage("newAnswer");
    };

    const handleNewComment = (aid = null) => {
        setAid(aid);
        setPage("newComment");
    };

    const handleSignup = () => {
        setPage("signup");
    }

    const handleLogin = () => {
        setPage("login");
    }

    const handleLogout = () => {
        setAccount("");
    }

    const handleProfile = (username) => {
        if (!username) {
            return;
        }
        setProfileUser(username);
        setPage("profile");
    }

    useEffect(() => {
        if (profileTick && account) {
            handleProfile(account);
        }
    }, [profileTick]);

    useEffect(() => {
        if (onPageChange) {
            onPageChange();
        }
    }, [page]);

    const getQuestionPage = (order = "newest", search = "") => {
        return (
            <QuestionPage
                title_text={title}
                order={order}
                search={search}
                setQuestionOrder={setQuestionOrder}
                clickTag={clickTag}
                handleAnswer={handleAnswer}
                handleComment={handleComment}
                handleNewQuestion={handleNewQuestion}
                handleSignup={handleSignup}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
                handleProfile={handleProfile}
                account={account}
            />
        );
    };

    switch (page) {
        case "home": {
            selected = "q";
            content = getQuestionPage(questionOrder.toLowerCase(), search);
            break;
        }
        case "tag": {
            selected = "t";
            content = (
                <TagPage
                    clickTag={clickTag}
                    handleNewQuestion={handleNewQuestion}
                    handleSignup={handleSignup}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                    account={account}
                />
            );
            break;
        }
        case "profile": {
            selected = "";
            content = (
                <ProfilePage
                    username={profileUser}
                    handleAnswer={handleAnswer}
                    handleSignup={handleSignup}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                    account={account}
                />
            );
            break;
        }
        case "answer": {
            selected = "";
            content = (
                <AnswerPage
                    qid={qid}
                    handleNewQuestion={handleNewQuestion}
                    handleNewAnswer={handleNewAnswer}
                    handleNewComment={handleNewComment}
                    handleSignup={handleSignup}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                    handleProfile={handleProfile}
                    account={account}
                />
            );
            break;
        }
        case "comment": {
            selected = "";
            content = (
                <AnswerPage
                    qid={qid}
                    handleNewQuestion={handleNewQuestion}
                    handleNewAnswer={handleNewAnswer}
                    handleNewComment={handleNewComment}
                    handleSignup={handleSignup}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                    handleProfile={handleProfile}
                    account={account}
                />

            );
            break;
        }
        case "newQuestion": {
            selected = "";
            content = 
                <NewQuestion 
                    handleQuestions={handleQuestions} 
                    handleSignup={handleSignup}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                    account={account}
                />;
            break;
        }
        case "newAnswer": {
            selected = "";
            content = 
                <NewAnswer 
                    qid={qid} 
                    handleAnswer={handleAnswer}
                    handleSignup={handleSignup} 
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                    account={account}
                />;
            break;
        }
        case "newComment": {
            selected = "";
            content = 
                <NewComment 
                    qid={qid} 
                    aid = {aid}
                    handleComment={handleComment}
                    handleSignup={handleSignup} 
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                    account={account}
                />;
            break;
        }

        case "signup": {
            selected = "";
            content = <Signup handleQuestions={handleQuestions} />
            break;
        }

        case "login": {
            selected = "";
            content = 
                <Login 
                    handleNewLogin={handleNewLogin}
                    account={account} />
            break;
        }
        default:
            selected = "q";
            content = getQuestionPage();
            break;
    }

    return (
        <div id="main" className="main">
            <SideBarNav
                selected={selected}
                handleQuestions={handleQuestions}
                handleTags={handleTags}
            />
            <div id="right_main" className="right_main">
                {content}
            </div>
        </div>
    );
};

export default Main;
