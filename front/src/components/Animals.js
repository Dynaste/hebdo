import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
    articleContainer: {
        backgroundColor: '#fff',
        padding: 5,
        margin: 5,
        borderRadius: 5,
        minWidth: 150,
        '&:hover': {
            cursor: 'pointer',
            opacity: 0.7
        }
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
}));

const Animals = ({ animals }) => {
    const classes = useStyles();

    const newAnimal = () => {
        console.log('WIP');
    };

    return (
        <div className={classes.container}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => newAnimal()}
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
                            >
                                <p>{item.name}</p>
                                <p>{item.type}</p>
                                <p>{item.race}</p>
                                <p>{item.age}</p>
                                <p>{item.weight}</p>
                            </Box>
                        )
                )}
            </div>
        </div>
    );
};

export default Animals;
