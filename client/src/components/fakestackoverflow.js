import { useState } from "react";
import Header from "./header";
import Main from "./main";

export default function FakeStackOverflow() {
    const [search, setSearch] = useState("");
    const [mainTitle, setMainTitle] = useState("All Questions");
    const [account, setAccount] = useState("");
    const [profileTick, setProfileTick] = useState(0);
    const [repTick, setRepTick] = useState(0);

    const setQuestionPage = (search = "", title = "All Questions") => {
        setSearch(search);
        setMainTitle(title);
    };

    return (
        <>
            <Header
                search={search}
                setQuestionPage={setQuestionPage}
                account={account}
                profileTick={repTick}
                onProfile={() => setProfileTick((tick) => tick + 1)}
            />
            <Main
                title={mainTitle}
                search={search}
                setQuestionPage={setQuestionPage}
                account={account}
                setAccount={setAccount}
                profileTick={profileTick}
                onPageChange={() => setRepTick((tick) => tick + 1)}
            />
        </>
    );
}
