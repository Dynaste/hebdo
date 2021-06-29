require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const {DB_USERNAME, DB_PASSWORD, DB_TABLE} = process.env;
const hostname = '127.0.0.1';
const port = process.env.PORT || 4000;
// const dbUrl = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.5yp3u.mongodb.net/${DB_TABLE}?retryWrites=true&w=majority`;
const dbUrl = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@cluster0-shard-00-00.5yp3u.mongodb.net:27017,cluster0-shard-00-01.5yp3u.mongodb.net:27017,cluster0-shard-00-02.5yp3u.mongodb.net:27017/${DB_TABLE}?ssl=true&replicaSet=atlas-k3o6xi-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose
    .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Connected on ${port} port !`);
    })
    .catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
    });


const animalRoutes = require('./api/routes/animalRoutes');
animalRoutes(app);


app.listen(port, hostname);