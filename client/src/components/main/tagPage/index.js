import { useEffect, useState } from "react";
import "./index.css";
import Tag from "./tag";
import { getTagsWithQuestionNumber } from "../../../services/tagService";

const TagPage = ({ clickTag, handleNewQuestion, handleSignup, handleLogin, handleLogout, account }) => {
    const [tlist, setTlist] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            let res = await getTagsWithQuestionNumber();
            setTlist(res || []);
        };

        fetchData().catch((e) => console.log(e));
    }, []);
    return (
        <>
            <div id="login" className="header_button">
                <button
                    className="bluebtn_login"
                    id="signupbtn"
                    onClick={() => {
                        handleSignup();
                    }}> 
                        Signup
                </button>
                <button
                    className="bluebtn_login"
                    id="loginbtn"
                    onClick={() => {
                        if (account) {
                            alert(`You are logged in as ${account}`)
                        } else {
                            handleLogin();
                        }
                    }}> 
                        Login
                </button>
                <button
                    className="bluebtn_login"
                    id="logoutbtn"
                    onClick={() => {
                        handleLogout();
                    }}> 
                        Logout
                </button>
            </div>
            <div className="space_between right_padding">
                <div className="bold_title">{tlist.length} Tags</div>
                <div className="bold_title">All Tags</div>
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
            <div className="tag_list right_padding">
                {tlist.map((t, idx) => (
                    <Tag key={idx} t={t} clickTag={clickTag} />
                ))}
            </div>
        </>
    );
};

export default TagPage;
