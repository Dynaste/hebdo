import axios from 'axios';

const isTokenStored = () => {
    const retrievedObject = localStorage.getItem('token');
    if(retrievedObject){
        JSON.parse(retrievedObject);
        return retrievedObject.token;
    }else {
        return ''
    }
    
}
const headers = {
    'Content-Type': 'application/json',
    'Authorization': isTokenStored()
}

export const get = async(path) => {
    const res = await axios.get(`${process.env.REACT_APP_END_POINT}${path}`, headers);
    return res;
}

export const logUser = async(body) => {
    try{
        console.log(`${process.env.REACT_APP_END_POINT}login`);
        console.log({body});
        console.log({headers})
        const res = await axios.post(`${process.env.REACT_APP_END_POINT}login`, body, headers);
        const storage = {
            token: res.data.data,
            timestamp: Math.floor(Date.now() / 1000)
        }
        localStorage.setItem('token', JSON.stringify(storage));
        return res;
    }catch(err){
        return err;
    }
    
}