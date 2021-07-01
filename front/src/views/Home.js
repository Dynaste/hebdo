import React from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { isTokenValid } from '../functions/useApi';

const Home = () => {
    const history = useHistory();

    return (
        <div>
            {isTokenValid() ? (
                <>
                    <h2>Home</h2>

                    <p onClick={() => history.push('/login')}>Login</p>
                    <p onClick={() => history.push('/signup')}>Signup</p>
                </>
            ) : (
                <Redirect to={{ pathname: '/login' }} />
            )}
        </div>
    );
};

export default Home;
