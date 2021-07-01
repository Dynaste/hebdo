import React from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { isTokenValid } from '../functions/useApi';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
        width: '50%',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    field: {
        margin: 5,
    },
    button: {
        margin: 5,
    },
    link: {
        margin: 5,
        color: '#1F85DE',
        '&:hover': {
            cursor: 'pointer',
        },
    },
}));

const Home = () => {
    const history = useHistory();
    const classes = useStyles();

    const log = () => {
        localStorage.removeItem('token');
        history.push('/login');
    }

    return (
        <div>
            {isTokenValid() ? (
                <div className={classes.root}>
                    <h2>Home</h2>

                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={() => log()}
                    >
                        {
                            isTokenValid() ? 'Logout' : 'Login'
                        }
                    </Button>
                </div>
            ) : (
                <Redirect to={{ pathname: '/login' }} />
            )}
        </div>
    );
};

export default Home;
