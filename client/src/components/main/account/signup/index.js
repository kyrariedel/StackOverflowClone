import "./index.css";
import { useState } from "react";
import Form from "../../baseComponents/form";
import Input from "../../baseComponents/input";
import "./index.css";

import { addAccount } from "../../../../services/accountService";

const Signup = ({ handleQuestions }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [usernameErr, setUsernameErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [nameErr, setNameErr] = useState("");

    const createAccount = async () => {
        let isValid = true;
        if (!username) {
            setUsernameErr("Username cannot be empty");
            isValid = false;
        } 

        if (!password) {
            setPasswordErr("Password cannot be empty");
            isValid = false;
        }

        if (!name) {
            setNameErr("Name cannot be empty");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const account = {
            username: username, 
            password: password, 
            name: name,
        }

        const res = await addAccount(account);
        if (res && res._id) {
            handleQuestions();
        }
    }
        
        return (
            <Form>
                <Input
                    title={"Username"}
                    id={"formAccountUsernameInput"}
                    val={username}
                    setState={setUsername}
                    err={usernameErr}>
                </Input>
                <Input
                    title={"Password"}
                    id={"formAccountPasswordInput"}
                    val={password}
                    setState={setPassword}
                    err={passwordErr}>
                </Input>
                <Input
                    title={"Name"}
                    id={"formAccountNameInput"}
                    val={name}
                    setState={setName}
                    err={nameErr}>
                </Input>
                <div className="btn_indicator_container">
                <button
                    className="form_postBtn"
                    onClick={() => {
                        createAccount();
                    }}
                >
                    Create Account
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
            </Form>
        )
}

export default Signup;