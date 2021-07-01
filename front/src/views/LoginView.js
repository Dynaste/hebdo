import React from 'react';
import Login from './../components/Login'
import { isTokenValid } from '../functions/useApi';
import { useHistory } from 'react-router-dom';

const LoginView = () => {
    const history = useHistory();

    React.useEffect(() => {
        if (isTokenValid()) {
            history.push('/');
        }
    }, [history]);

    return (
        <>
            <Login />
        </>
    );
};

export default LoginView;