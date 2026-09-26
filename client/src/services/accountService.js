import { REACT_APP_API_URL, api } from "./config";

const ACCOUNT_API_URL = `${REACT_APP_API_URL}/account`;

// To add Account
const addAccount = async (a) => {
    const res = await api.post(`${ACCOUNT_API_URL}/addAccount`, a);

    return res.data;
};

// Authenticates account and logs in
const authenticateAccount = async (username, password) => {
    const res = await api.get(`${ACCOUNT_API_URL}/authenticateAccount?username=${username}&password=${password}`);

    return res.data;
}


const getProfile = async (username) => {
    const res = await api.get(`${ACCOUNT_API_URL}/profile/${encodeURIComponent(username)}`);

    return res.data;
};

export { addAccount, authenticateAccount, getProfile };