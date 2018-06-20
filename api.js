const express = require('express');
const helmet = require('helmet');
const expressJWT = require('express-jwt');

const PORT = process.env['PORT']
const DBHOST = process.env['DBHOST']
const DBUSER = process.env['DBUSER']
const DBPASS = process.env['DBPASS']
const JWTSEC = process.env['JWTSEC']
if (!PORT) {
    throw new Error('Must have application port stored in environment variable PORT');
}
if (!DBHOST) {
    throw new Error('Must have DB connection host stored in environment variable HOST');
}
if (!DBUSER) {
    throw new Error('Must have DB connection username stored in environment variable DBUSER');
}
if (!DBPASS) {
    throw new Error('Must have DB connection password stored in environment variable DBPASS');
}
if (!JWTSEC) {
    throw new Error('Must have JWT Secret stored in environment variable JWTSEC');
}

const login = require('./routes/login');

const app = express();

app.use(helmet());
app.use(expressJWT({ secret: JWTSEC }).unless({path: ['/login']}));
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.sendStatus(401);
    }
});
app.use(express.json());

app.use('/login', login);
app.get('/', (req, res) => {
    res.send('Hi');
});

app.listen(PORT, (err) => {
    if (err) {
        throw err;
    }
    console.log(`Listening on port ${PORT}`);
});
