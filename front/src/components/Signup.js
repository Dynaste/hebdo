import React from 'react';
import { signUser } from './../functions/useApi';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';

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
            cursor: 'pointer'
        }
    }
}));

const Signup = () => {
    const classes = useStyles();
    const history = useHistory();

    const [myForm, setMyForm] = React.useState({
        email: '',
        password: ''
    });
    const [confirmPwd, setConfirmPwd] = React.useState(null);
    const enabled =
          myForm.email.length >= 4 &&
          myForm.password.length >= 4;

    const handleClick = () => {
        history.push('/login');
    };

    const onChange = (event, inputName) => {
        setMyForm({
            ...myForm,
            [inputName]: event.target.value,
        });
    };

    const verifPwd = (event) => {
        setConfirmPwd(event.target.value)
    }

    const sign = async () => {
        const res = await signUser(myForm);
        console.log(res);
        if(res.status === 202){
            history.push('/login')
        }
    };
    return (
        <div className={classes.root}>
            <h2>Page d'inscription</h2>
            <TextField
                className={classes.field}
                required
                onChange={(event) => onChange(event, 'email')}
                label="Email"
                variant="outlined"
            />
            <TextField
                className={classes.field}
                required
                onChange={(event) => onChange(event, 'password')}
                label="Password"
                type="password"
                variant="outlined"
            />
            <TextField
                className={classes.field}
                required
                error = {confirmPwd !== myForm.password ? true : false}
                onChange={(event) => verifPwd(event)}
                label="Confirm password"
                type="password"
                variant="outlined"
            />
            <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={sign}
                disabled={!enabled}
            >
                inscription
            </Button>
            <p className={classes.link} onClick={handleClick}>
                Retourner sur la page de connexion
            </p>
        </div>
    );
};

export default Signup;
