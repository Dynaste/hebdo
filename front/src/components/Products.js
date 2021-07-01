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
import { isAdmin, post, put, del } from '../functions/useApi';

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

const Products = ({ products, setReload, reload }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [dialogContent, setDialogContent] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(false);

    const [newProduct, setNewProduct] = React.useState({
        type: 1,
    });

    React.useEffect(() => {
        console.log(products)
    }, [])

    const handleClickOpen = (type) => {
        setDialogContent(type);
        if (type === 'PUT') {
            setNewProduct({
                name: selectedProduct.name,
                category: selectedProduct.category,
                description: selectedProduct.description,
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const openProduct = async (item) => {
        setSelectedProduct(item);
        handleClickOpen('GET');
    };

    const onChange = (inputName, event, type = 'string') => {
        if (type === 'string') {
            setNewProduct({
                ...newProduct,
                [inputName]: event.target.value,
            });
        } else if (type === 'number') {
            setNewProduct({
                ...newProduct,
                [inputName]: +event.target.value,
            });
        }
    };

    const postNewProduct = async () => {
        const res = await post('products/create', newProduct);

        if (res.status === 201) {
            handleClose();
            setNewProduct({
                type: 1,
            });
            setReload(!reload);
        } else {
            alert(res.data.message);
        }
    };

    // const updateProduct = async () => {
    //     const res = await put(
    //         `products/${selectedProduct._id}/update`,
    //         newProduct
    //     );

    //     if (res.status === 201) {
    //         handleClose();
    //         setNewProduct();
    //         setReload(!reload);
    //     } else {
    //         alert(res.data.message);
    //     }
    // };

    const deleteProduct = async () => {
        const res = await del(`products/${selectedProduct._id}/delete`);

        if (res.status === 204) {
            handleClose();
            setNewProduct(null);
            setReload(!reload);
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
                    Ajouter un produit
                </Button>
            )}

            <div className={classes.listContainer}>
                {products.map(
                    (item, key) =>
                            <Box
                                boxShadow={1}
                                className={classes.articleContainer}
                                key={key}
                                onClick={() => openProduct(item)}
                            >
                                <p>{item.name}</p>
                                <p>Category: {item.category}</p>
                                <p>Description: {item.description}</p>
                            </Box>
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
                            Ajout d'un produit
                        </DialogTitle>
                        <DialogContent className={classes.dialogContent}>
                            <TextField
                                margin="dense"
                                label="Nom"
                                onChange={(event) => onChange('name', event)}
                            />
                            <TextField
                                margin="dense"
                                label="Categorie"
                                onChange={(event) => onChange('category', event)}
                            />
                            <TextField
                                margin="dense"
                                label="Description"
                                multiline
                                onChange={(event) => onChange('description', event)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Annuler
                            </Button>
                            <Button
                                onClick={() => postNewProduct()}
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
                            {selectedProduct.name}
                        </DialogTitle>
                        <DialogContent style={{ textAlign: 'center' }}>
                            <h4>Categorie: {selectedProduct.category}</h4>
                            <p>Description: {selectedProduct.description}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Fermer
                            </Button>
                            {isAdmin() && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => deleteProduct()}
                                    >
                                        Supprimer
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleClickOpen('PUT')}
                                    >
                                        Editer
                                    </Button>
                                </>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default Products;
