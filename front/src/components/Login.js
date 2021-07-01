import React from 'react';
import {logUser} from './../functions/useApi';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
        width: '50%',
        textAlign: 'center',
    },
}));

const Login = () => {
    const classes = useStyles();

    const log = async() => {
        const body = {
            email: 'admin42@gmail.com',
            password: 'root'
        };
        const res = await logUser(body);
        console.log(res);
    }
    return (
        <div className={classes.root}>
            <h2>HELLO LOGIN COMP</h2>
            <Button variant="contained" color="primary" onClick={log}>
                Primary
            </Button>
        </div>
    );
};

export default Login;
