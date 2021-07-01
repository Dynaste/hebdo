import React from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { isTokenValid, get } from '../functions/useApi';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Articles from '../components/Articles';
import Animals from '../components/Animals';
import Products from '../components/Articles';

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
        // display: 'flex',
        // justifyContent: 'center',
        // flexWrap: 'wrap',
        boxSizing: 'border-box',
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

    const [articles, setArticles] = React.useState(null);
    const [animals, setAnimals] = React.useState(null);
    const [products, setProducts] = React.useState(null);
    const [value, setValue] = React.useState(0);
    const [reload, setReload] = React.useState(false);

    const log = () => {
        localStorage.removeItem('token');
        history.push('/login');
    };

    const getArticles = async () => {
        const res = await get('articles');
        if ((res.statusCode = 200)) {
            setArticles(res.data.data);
        }
    };

    const getAnimals = async () => {
        const res = await get('animals');
        console.log(res);
        if ((res.statusCode = 200)) {
            setAnimals(res.data.data);
        }
    };

    React.useEffect(() => {
        isTokenValid() && getArticles();
        isTokenValid() && getAnimals();
    }, [reload]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                        {isTokenValid() ? 'Logout' : 'Login'}
                    </Button>
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
                            aria-label="full width tabs example"
                        >
                            <Tab label="Articles" />
                            <Tab label="Animals" />
                            <Tab label="Products" />
                            <Tab label="Donations" />
                        </Tabs>
                    </AppBar>
                    <TabPanel
                        value={value}
                        index={0}
                        className={classes.tabPanelContent}
                    >
                        {articles && <Articles articles={articles} setReload={setReload} reload={reload}/>}
                    </TabPanel>
                    <TabPanel
                        value={value}
                        index={1}
                        className={classes.tabPanelContent}
                    >
                        {animals && <Animals animals={animals} setReload={setReload} reload={reload}/>}
                    </TabPanel>
                    <TabPanel
                        value={value}
                        index={2}
                        className={classes.articleContainer}
                    >
                        {products && <Products products={products} setReload={setReload} reload={reload}/>}
                    </TabPanel>
                </div>
            ) : (
                <Redirect to={{ pathname: '/login' }} />
            )}
        </div>
    );
};

export default Home;
