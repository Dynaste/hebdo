import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { MenuItem } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import { isAdmin, post, put } from '../functions/useApi';

const useStyles = makeStyles(() => ({
    articleContainer: {
        backgroundColor: '#fff',
        padding: 5,
        margin: 5,
        borderRadius: 5,
        minWidth: 150,
        '&:hover': {
            cursor: 'pointer',
            opacity: 0.7,
        },
    },
    container: {
        background: '#f5f5f5',
        boxSizing: 'border-box',
    },
    listContainer: {
        marginTop: 5,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    dialogContent: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
    },
}));

const Animals = ({ animals }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [dialogContent, setDialogContent] = React.useState(false);
    const [selectedAnimal, setSelectedAnimal] = React.useState(false);

    const [newAnimal, setNewAnimal] = React.useState({
        type: 1,
    });

    const handleClickOpen = (type) => {
        setDialogContent(type);
        if(type==='PUT'){
            const typeValue = typeChoice.find(item => item.label === selectedAnimal.type);
            console.log(typeValue.value)
            setNewAnimal({
                name: selectedAnimal.name,
                weight: selectedAnimal.weight,
                age: selectedAnimal.age,
                type: typeValue.value,
                race: selectedAnimal.race,
            })
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const typeChoice = [
        { value: 1, label: 'Chien' },
        { value: 2, label: 'Chat' },
        { value: 3, label: 'Cheval' },
        { value: 4, label: 'Rat' },
        { value: 5, label: 'Lapin' },
        { value: 6, label: 'Furet' },
    ];

    const openAnimal = async (item) => {
        setSelectedAnimal(item);
        handleClickOpen('GET');
    };

    const onChange = (inputName, event, type = 'string') => {
        if (type === 'string') {
            setNewAnimal({
                ...newAnimal,
                [inputName]: event.target.value,
            });
        } else if (type === 'number') {
            setNewAnimal({
                ...newAnimal,
                [inputName]: +event.target.value,
            });
        }
    };

    const postNewAnimal = async () => {
        console.log(newAnimal);
        const res = await post('animals/create', newAnimal);
        console.log(res);

        if (res.status === 201) {
            handleClose();
            setNewAnimal(null);
        } else {
            alert(res.data.message);
        }
    };

    const updateAnimal = async () => {
        console.log(newAnimal);
        const res = await put(`animals/${selectedAnimal._id}/update`, newAnimal);
        console.log(res);

        if (res.status === 201) {
            handleClose();
            setNewAnimal(null);
        } else {
            alert(res.data.message);
        }
    };

    return (
        <div className={classes.container}>
            {isAdmin() && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleClickOpen('POST')}
                >
                    Ajouter un animal
                </Button>
            )}

            <div className={classes.listContainer}>
                {animals.map(
                    (item, key) =>
                        item !== '_options' && (
                            <Box
                                boxShadow={1}
                                className={classes.articleContainer}
                                key={key}
                                onClick={() => openAnimal(item)}
                            >
                                <p>{item.name}</p>
                                <p>Type: {item.type}</p>
                                <p>Race: {item.race}</p>
                            </Box>
                        )
                )}
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                {dialogContent === 'POST' && (
                    <>
                        <DialogTitle id="form-dialog-title">
                            Ajout d'un animal
                        </DialogTitle>
                        <DialogContent className={classes.dialogContent}>
                            <TextField
                                margin="dense"
                                label="Nom"
                                onChange={(event) => onChange('name', event)}
                            />
                            <TextField
                                select
                                label="Type"
                                margin="dense"
                                value={newAnimal.type}
                                onChange={(event) => onChange('type', event)}
                                helperText="Please select the type of your animal"
                            >
                                {typeChoice.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                margin="dense"
                                label="Race"
                                onChange={(event) => onChange('race', event)}
                            />
                            <TextField
                                margin="dense"
                                label="Poids"
                                onChange={(event) =>
                                    onChange('weight', event, 'number')
                                }
                            />

                            <TextField
                                margin="dense"
                                label="Age"
                                onChange={(event) =>
                                    onChange('age', event, 'number')
                                }
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Annuler
                            </Button>
                            <Button
                                onClick={() => postNewAnimal()}
                                color="primary"
                            >
                                Envoyer
                            </Button>
                        </DialogActions>
                    </>
                )}
                {dialogContent === 'GET' && (
                    <>
                        <DialogTitle id="form-dialog-title">
                            {selectedAnimal.name}
                        </DialogTitle>
                        <DialogContent style={{ textAlign: 'center' }}>
                            <h4>Type: {selectedAnimal.type}</h4>
                            <h4>Race: {selectedAnimal.race}</h4>
                            <p>Poids: {selectedAnimal.weight}</p>
                            <p>Age: {selectedAnimal.age}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Fermer
                            </Button>
                            {isAdmin() && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleClickOpen('PUT')}
                                >
                                    Editer
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
                {dialogContent === 'PUT' && (
                    <>
                        <DialogTitle id="form-dialog-title">
                            {selectedAnimal.name}
                        </DialogTitle>
                        <DialogContent className={classes.dialogContent}>
                            <TextField
                                margin="dense"
                                label="Nom"
                                value={newAnimal.name}
                                onChange={(event) => onChange('name', event)}
                            />
                            <TextField
                                margin="dense"
                                label="Race"
                                value={newAnimal.race}
                                onChange={(event) => onChange('race', event)}
                            />
                            <TextField
                                margin="dense"
                                label="Poids"
                                value={newAnimal.weight}
                                onChange={(event) =>
                                    onChange('weight', event, 'number')
                                }
                            />
                            <TextField
                                margin="dense"
                                label="Age"
                                value={newAnimal.age}
                                onChange={(event) =>
                                    onChange('age', event, 'number')
                                }
                            />
                            <h4>Type: {selectedAnimal.type}</h4>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Annuler
                            </Button>
                            <Button
                                onClick={() => updateAnimal()}
                                color="primary"
                            >
                                Modifier
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default Animals;
