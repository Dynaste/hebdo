import React from 'react';
import Signup from '../components/Signup';
import { isTokenValid } from '../functions/useApi';
import { useHistory } from 'react-router-dom';

const SignupView = () => {
    const history = useHistory();

    React.useEffect(() => {
        if (isTokenValid()) {
            history.push('/');
        }
    }, [history]);
    return (
        <>
            <Signup />
        </>
    );
};

export default SignupView;
