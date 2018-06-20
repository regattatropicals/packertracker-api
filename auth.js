const scrypt = require('scrypt');
const jwt = require('jsonwebtoken');

const JWTSEC = process.env['JWTSEC']

function verifyPassword(password, salt, saltedHash) {
    saltedPassword = salt.toString('ascii') + password;

    return scrypt.verifyKdf(saltedHash, saltedPassword);
}

function buildJWT(payload, expiration) {
    return new Promise((resolve, reject) => {
        options = {};
        if (expiration) {
            options['expiresIn'] = expiration;
        }

        jwt.sign(payload, JWTSEC, options, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    })
}

function isValidJWT(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWTSEC, {}, (err, decoded) => {
            if (err) {
                resolve(false);
            }
            resolve(true);
        })
    })
}

module.exports = {
    verifyPassword: verifyPassword,
    buildJWT: buildJWT,
    isValidJWT: isValidJWT
}
