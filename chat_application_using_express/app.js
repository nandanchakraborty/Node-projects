// external imports
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
dotenv.config();
// internal imports
const { errorHandler, notFoundHandler } = require('./middleware/common/errorHandler');

const loginRouter = require('./Router/loginRouter');
const usersRouter = require('./Router/usersRouter');
const inboxRouter = require('./Router/inboxRouter');

// database connection

mongoose
    .connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// reqiest parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine

app.set('view engine', 'ejs');

// set static folder

app.use(express.static(path.join(__dirname, 'public')));

// parse cookies

app.use(cookieParser(process.env.COOKIE_SECRET));
// routing
app.use('/', loginRouter);
// app.use('/',usersRouter);

// app.use('/',inboxRouter);

// error handling 404 not found
app.use(notFoundHandler);
// common error
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`app listen to port ${process.env.PORT}`);
});
