require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API',
        version: '1.0.0',
      },
      servers: {
          url: 'http://127.0.0.1:4000'
      }
    },
    apis: ['./routes/*.js'], // files containing annotations as above
};

const swaggerSpec = swaggerJsdoc(options);
const setupOptions = {
    explorerUrl: true
}

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, setupOptions));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const {port, baseUrl: hostname} = require('./config');
const {DB_USERNAME, DB_PASSWORD, DB_TABLE} = process.env;
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


const animalRoutes = require('./routes/animalRoutes');
animalRoutes(app);
const userRoutes = require('./routes/userRoutes');
userRoutes(app);
// const articleRoutes = require('./routes/articleRoutes');
// articleRoutes(app);


process.setMaxListeners(0);
app.listen(port, hostname);