import React from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { isTokenValid, get } from '../functions/useApi';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { MenuItem } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';

import Articles from '../components/Articles';
import Animals from '../components/Animals';
import Products from '../components/Products';
import Adoptions from '../components/Adoptions';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
        width: '80%',
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
    tabContainer: {
        marginTop: 5,
    },
    tabPanelContent: {
        padding: 10,
        background: '#f5f5f5',
        width: '100%',
        boxSizing: 'border-box',
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    cartContainer: {
        marginLeft: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    cartCount: {
        position: 'absolute',
        top: -10,
        right: -10,
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-prevent-tabpanel-${index}`}
            aria-labelledby={`scrollable-prevent-tab-${index}`}
            {...other}
        >
            {value === index && <>{children}</>}
        </div>
    );
}

const Home = () => {
    const history = useHistory();
    const classes = useStyles();

    const [articles, setArticles] = React.useState(false);
    const [animals, setAnimals] = React.useState(null);
    const [products, setProducts] = React.useState(null);
    const [adoptions, setAdoptions] = React.useState(null);
    const [value, setValue] = React.useState(0);
    const [reload, setReload] = React.useState(false);
    const [cart, setCart] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    const log = () => {
        localStorage.removeItem('token');
        history.push('/login');
    };

    const getArticles = async () => {
        const res = await get('articles');
        await setArticles(res.data.data);
    };

    const getAnimals = async () => {
        const res = await get('animals');
        await setAnimals(res.data.data);
    };

    const getProducts = async () => {
        const res = await get('products');
        await setProducts(res.data.data);
    };

    const getAdoptions = async() => {
        const res = await get('animals/adopted');
        await setAdoptions(res.data.data);
        console.log(res);
    }

    React.useEffect(() => {
        isTokenValid() && getArticles();
        isTokenValid() && getAnimals();
        isTokenValid() && getProducts();
        isTokenValid() && getAdoptions();
    }, [reload]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            {isTokenValid() ? (
                <div className={classes.root}>
                    <h2>Home</h2>

                    <div className={classes.header}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={() => log()}
                        >
                            {isTokenValid() ? 'Logout' : 'Login'}
                        </Button>
                        <div
                            className={classes.cartContainer}
                            onClick={() => handleClickOpen()}
                        >
                            <ShoppingCartIcon color="primary" />
                            <span className={classes.cartCount}>
                                {cart.length}
                            </span>
                        </div>
                    </div>
                    <AppBar
                        position="static"
                        color="default"
                        className={classes.tabContainer}
                    >
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                        >
                            <Tab label="Articles" />
                            <Tab label="Animaux" />
                            <Tab label="Produits" />
                            <Tab label="Donations" />
                            <Tab label="Adoptions du mois" />
                        </Tabs>
                    </AppBar>
                    <TabPanel
                        value={value}
                        index={0}
                        className={classes.tabPanelContent}
                    >
                        {articles && (
                            <Articles
                                articles={articles}
                                setReload={setReload}
                                reload={reload}
                            />
                        )}
                    </TabPanel>
                    <TabPanel
                        value={value}
                        index={1}
                        className={classes.tabPanelContent}
                    >
                        {animals && (
                            <Animals
                                animals={animals}
                                setReload={setReload}
                                reload={reload}
                            />
                        )}
                    </TabPanel>
                    <TabPanel
                        value={value}
                        index={2}
                        className={classes.tabPanelContent}
                    >
                        {products && (
                            <Products
                                products={products}
                                setReload={setReload}
                                reload={reload}
                                setCart={setCart}
                                cart={cart}
                            />
                        )}
                    </TabPanel>
                    <TabPanel
                        value={value}
                        index={3}
                        className={classes.tabPanelContent}
                    ></TabPanel>
                    <TabPanel
                        value={value}
                        index={4}
                        className={classes.tabPanelContent}
                    >
                        { adoptions && <Adoptions adoptions={adoptions}/>}
                    </TabPanel>
                </div>
            ) : (
                <Redirect to={{ pathname: '/login' }} />
            )}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <>
                    <DialogTitle id="form-dialog-title">Mon panier</DialogTitle>
                    <DialogContent style={{ textAlign: 'center' }}>
                        {cart &&
                            cart.map((item, key) => (
                                <>
                                    <p key={key}>Produit: {item.name}</p>
                                </>
                            ))}
                        {/* <h4>Categorie: {selectedProduct.category}</h4>
                        <p>Description: {selectedProduct.description}</p> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Fermer
                        </Button>
                        <Button
                            onClick={handleClose}
                            variant="contained"
                            color="primary"
                        >
                            Valider mon panier
                        </Button>
                    </DialogActions>
                </>
            </Dialog>
        </div>
    );
};

export default Home;
