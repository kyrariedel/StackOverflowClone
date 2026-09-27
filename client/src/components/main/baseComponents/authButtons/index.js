const AuthButtons = ({ account, handleSignup, handleLogin, handleLogout }) => {
    return (
        <div id="login" className="header_auth">
            {!account && (
                <>
                    <button
                        className="bluebtn_login signupbtn"
                        id="signupbtn"
                        onClick={handleSignup}
                    >
                        Signup
                    </button>
                    <button
                        className="bluebtn_login loginbtn"
                        id="loginbtn"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </>
            )}
            {account && (
                <button
                    className="bluebtn_login logoutbtn"
                    id="logoutbtn"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            )}
        </div>
    );
};

export default AuthButtons;
