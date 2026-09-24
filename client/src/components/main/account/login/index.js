import "./index.css";
import { useState } from "react";
import Form from "../../baseComponents/form";
import Input from "../../baseComponents/input";
import "./index.css";

import { authenticateAccount } from "../../../../services/accountService";

const Login = ({ handleNewLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameErr, setUsernameErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");

    const [indicator, setIndicator] = useState("* indicates mandatory fields")

    const checkAccount = async () => {
        let isValid = true;
        if (!username) {
            setUsernameErr("Username cannot be empty");
            isValid = false;
        } 
    
        if (!password) {
            setPasswordErr("Password cannot be empty");
            isValid = false;
        }
    
        const res = await authenticateAccount(username, password);
        
        if (res) {
            handleNewLogin(res);
        } else {
            setIndicator("Username or password is incorrect");
            isValid = false;
        }

        if (!isValid) {
            return;
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
            <div className="btn_indicator_container">
            <button
                className="form_postBtn"
                onClick={() => {
                    checkAccount();
                }}
            >
                Login
            </button>
            <div className="mandatory_indicator">
                {indicator}
            </div>
        </div>
        </Form>
    )
}

export default Login;