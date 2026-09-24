import "./index.css";
import { useState } from "react";
import Form from "../baseComponents/form";
import Textarea from "../baseComponents/textarea";
import { validateHyperlink } from "../../../tool";
import { addComment } from "../../../services/commentService";

const NewComment = ({ qid, aid, handleComment, handleSignup, handleLogin, handleLogout, account }) => {
    const [text, setText] = useState("");
    const [textErr, setTextErr] = useState("");
    const postComment = async () => {
        let isValid = true;

        if (!text) {
            setTextErr("Comment text cannot be empty");
            isValid = false;
        }

        // Hyperlink validation
        if (!validateHyperlink(text)) {
            setTextErr("Invalid hyperlink format.");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const comment = {
            text: text,
            com_by: account,
            com_date_time: new Date(),
        };

        const res = await addComment(qid, aid, comment);
        if (res && res._id) {
            handleComment(qid, aid);
        }
    };
    return (
        <div>
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
            <div className="header_buffer">
                &nbsp;
            </div>
            <Form>
                <Textarea
                    title={"Comment Text"}
                    id={"commentTextInput"}
                    val={text}
                    setState={setText}
                    err={textErr}
                />
                <div className="btn_indicator_container">
                    <button
                        className="form_postBtn"
                        onClick={() => {
                            postComment();
                        }}
                    >
                        Post Comment
                    </button>
                    <div className="mandatory_indicator">
                        * indicates mandatory fields
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default NewComment;
