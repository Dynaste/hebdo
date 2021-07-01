import React from 'react';
import { logUser } from './../functions/useApi';
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

    const [myForm, setMyForm] = React.useState(null);

    const handleClick = () => {
        history.push('/login');
    };

    const onChange = (event, inputName) => {
        setMyForm({
            ...myForm,
            [inputName]: event.target.value,
        });
    };

    const log = async () => {
        const res = await logUser(myForm);
        console.log(res);
        if(res.status === 202){
            history.push('/')
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
            <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={log}
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
