import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { getLink } from '../functions/useApi';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    contentField: {
        width: '100%',
        marginTop: 35,
    },
}));

const Animals = ({ animals }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [dialogContent, setDialogContent] = React.useState(false);
    const [selectedAnimal, setSelectedAnimal] = React.useState(false);

    const handleClickOpen = (type) => {
        setDialogContent(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const openAnimal = async(item) => {
        setSelectedAnimal(item);
        handleClickOpen('GET')
    }

    return (
        <div className={classes.container}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleClickOpen('POST')}
            >
                Ajouter un animal
            </Button>
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
                                {/* <p>{item.age}</p>
                                <p>{item.weight}</p> */}
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
                        <DialogContent>
                            <TextField
                                margin="dense"
                                id="name"
                                label="Titre"
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="name"
                                label="Sous-titre"
                                fullWidth
                            />
                            <TextareaAutosize
                                aria-label="minimum height"
                                rowsMin={10}
                                placeholder="Contenu de l'article"
                                className={classes.contentField}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Annuler
                            </Button>
                            <Button onClick={handleClose} color="primary">
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
                        <DialogContent style={{textAlign: 'center'}}>
                            <h4>Type: {selectedAnimal.type}</h4>
                            <h4>Race: {selectedAnimal.race}</h4>
                            <p>Poids: {selectedAnimal.weight}</p>
                            <p>Age: {selectedAnimal.age}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Fermer
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default Animals;


