import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import moment from 'moment';

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
}));

const Adoptions = ({adoptions}) => {
    const classes = useStyles();
    const timeNow = Date.now();

    return (
        <div>
            {adoptions &&
                adoptions.map((item, key) => (
                    timeNow - (moment(item.adoptDate).unix()*1000) <= 2592000 &&
                    <Box
                        boxShadow={1}
                        className={classes.articleContainer}
                        key={key}
                    >
                        <p>{item.name}</p>
                        <p>Type: {item.type}</p>
                        <p>Race: {item.race}</p>
                        {item.adoptDate && (
                            <p>
                                Adopté le{' '}
                                {moment(item.adoptDate).format('MM/DD/YYYY')}
                            </p>
                        )}
                    </Box>
                ))}
        </div>
    );
};

export default Adoptions;
