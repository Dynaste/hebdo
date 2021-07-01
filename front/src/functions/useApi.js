import axios from 'axios';

const isTokenStored = () => {
    const retrievedObject = localStorage.getItem('token');
    if (
        retrievedObject &&
        Math.floor(Date.now() / 1000) - retrievedObject.timestamp < 86400
    ) {
        JSON.parse(retrievedObject);
        return retrievedObject.token;
    } else {
        return '';
    }
};
const headers = {
    'Content-Type': 'application/json',
    'Authorization': isTokenStored(),
};

export const isTokenValid = () => {
    const retrievedObject = localStorage.getItem('token');
    if (retrievedObject) {
        JSON.parse(retrievedObject);
        if (
            Math.floor(Date.now() / 1000) - retrievedObject.timestamp >=
            86400
        ) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};

export const get = async (path) => {
    const res = await axios.get(
        `${process.env.REACT_APP_END_POINT}${path}`,
        headers
    );
    return res;
};

export const logUser = async (body) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_END_POINT}login`,
            body,
            headers
        );
        const storage = {
            token: res.data.data,
            timestamp: Math.floor(Date.now() / 1000),
        };
        localStorage.setItem('token', JSON.stringify(storage));
        return res;
    } catch (err) {
        return err;
    }
};

export const signUser = async (body) => {
    try {
        const sign = await axios.post(
            `${process.env.REACT_APP_END_POINT}users/create`,
            body,
            headers
        );
        if(sign.status === 201){
            const res = await logUser(body);
            return res;
        }
    } catch (err) {
        return err;
    }
};
