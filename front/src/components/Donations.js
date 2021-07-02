import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import {post} from './../functions/useApi';

const useStyles = makeStyles(() => ({
    container: {
        background: '#f5f5f5',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    button: {
        marginTop: 20
    }
}));

const Donations = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const onChange = (event) => {
        setValue( +event.target.value);
    };

    const postDonations = async() => {
        const res = await post('donations/give', {amount: value});
        console.log(res)
        if(res.status === 201){
            alert(`Vous avez donné ${value} €, Merci beaucoup !`)
        }
        else{
            alert(res.message)
        }
    }
    return (
        <div className={classes.container}>
            <TextField
                margin="dense"
                label="Valeur du don"
                type="number"
                onChange={(event) => onChange(event)}
            />
            <Button
            className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => postDonations()}
                >
                    Faire un don de {value} €
                </Button>
        </div>
    );
};

export default Donations;
