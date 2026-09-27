import { useState } from "react";
import Header from "./header";
import Main from "./main";

export default function FakeStackOverflow() {
    const [search, setSearch] = useState("");
    const [mainTitle, setMainTitle] = useState("All Questions");
    const [account, setAccount] = useState("");
    const [profileTick, setProfileTick] = useState(0);
    const [repTick, setRepTick] = useState(0);
    const [authAction, setAuthAction] = useState({ name: "", tick: 0 });

    const setQuestionPage = (search = "", title = "All Questions") => {
        setSearch(search);
        setMainTitle(title);
    };

    return (
        <div className="app_shell">
            <Header
                search={search}
                setQuestionPage={setQuestionPage}
                account={account}
                profileTick={repTick}
                onProfile={() => setProfileTick((tick) => tick + 1)}
                onSignup={() => setAuthAction({ name: "signup", tick: Date.now() })}
                onLogin={() => setAuthAction({ name: "login", tick: Date.now() })}
                onLogout={() => setAuthAction({ name: "logout", tick: Date.now() })}
            />
            <Main
                title={mainTitle}
                search={search}
                setQuestionPage={setQuestionPage}
                account={account}
                setAccount={setAccount}
                profileTick={profileTick}
                authAction={authAction}
                onPageChange={() => setRepTick((tick) => tick + 1)}
            />
        </div>
    );
}
