import "./index.css";
import { useEffect, useState } from "react";
import Avatar from "../main/baseComponents/avatar";
import { getProfile } from "../../services/accountService";

const formatReputation = (value) => {
    const reputation = Number(value) || 0;
    if (Math.abs(reputation) < 10000) {
        return String(reputation);
    }
    const thousands = Math.trunc(reputation / 100) / 10;
    const text = Number.isInteger(thousands) ? String(thousands) : thousands.toFixed(1);
    return `${text}k`;
};

const Header = ({ search, setQuestionPage, account, onProfile, profileTick }) => {
    const [val, setVal] = useState(search);
    const [reputation, setReputation] = useState(null);

    useEffect(() => {
        setVal(search);
    }, [search]);

    useEffect(() => {
        if (!account) {
            setReputation(null);
            return;
        }
        let cancelled = false;
        getProfile(account)
            .then((profile) => {
                if (!cancelled && profile) {
                    setReputation(profile.reputation);
                }
            })
            .catch((error) => console.log(error));
        return () => {
            cancelled = true;
        };
    }, [account, profileTick]);

    return (
        <div id="header" className="header">
            <div></div>
            <div className="title">Stack Overflow</div>
            <div className="header_search">
                <input
                    id="searchBar"
                    placeholder="Search ..."
                    type="text"
                    value={val}
                    onChange={(e) => {
                        setVal(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            setQuestionPage(e.target.value, "Search Results");
                        }
                    }}
                />
                {account && (
                    <button
                        id="header_profile"
                        className="header_profile"
                        onClick={onProfile}
                    >
                        <Avatar username={account} size={32} />
                        <span>{reputation == null ? "" : formatReputation(reputation)}</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Header;
