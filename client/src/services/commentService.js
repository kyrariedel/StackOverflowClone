import { REACT_APP_API_URL, api } from "./config";

const COMMENT_API_URL = `${REACT_APP_API_URL}/comment`;

// To add comment
const addComment = async (qid, aid, com) => {
    const data = { qid: qid, aid: aid, com: com };
    const res = await api.post(`${COMMENT_API_URL}/addComment`, data);

    return res.data;
};

const upvoteComment = async (account, cid) => {
    const res = await api.get(`${COMMENT_API_URL}/upvoteComment?username=${account}&cid=${cid}`);

    return res.data;
};

const getCommentById = async (id) => {
    const res = await api.get(`${COMMENT_API_URL}/getQuestionById/${id}`);

    return res.data;
};

export { addComment, upvoteComment, getCommentById };
