import { REACT_APP_API_URL, api } from "./config";

const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

// To add answer
const addAnswer = async (qid, ans) => {
    const data = { qid: qid, ans: ans };
    const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);

    return res.data;
};

const upvoteAnswer = async (account, aid) => {
    const res = await api.get(`${ANSWER_API_URL}/upvoteAnswer?username=${account}&aid=${aid}`);

    return res.data;
};

const downvoteAnswer = async (account, aid) => {
    const res = await api.get(`${ANSWER_API_URL}/downvoteAnswer?username=${account}&aid=${aid}`);

    return res.data;
};

const acceptAnswer = async (qid, aid, username) => {
    const res = await api.post(`${ANSWER_API_URL}/acceptAnswer`, {
        qid,
        aid,
        username,
    });

    return res.data;
};

export { addAnswer, upvoteAnswer, downvoteAnswer, acceptAnswer };
