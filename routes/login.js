const express = require('express');

const query = require('../utils/db');
const { verifyPassword, buildJWT, isValidJWT } = require('../utils/auth');

const router = express.Router();

router.post('/', async (req, res, next) => {
    /* If the login request already has a valid JWT attached to it,
     * resend the old, valid token.
     * This is a precaution to minimize the number of concurrently
     * valid tokens for a given user.
     */
    if (await isValidJWT(req.cookies.access_token)) {
        return res.sendStatus(200);
    }

    let username;
    let password;
    try {
        username = req.body.username;
        password = req.body.password;
    } catch (err) {
        /* The login request was malformed, so return a client error. */
        console.log(err);
        return res.sendStatus(400);
    }

    try {
        const credentialLookup = await query(`
            SELECT employee_id, salt, salted_hash, is_admin, is_raspi FROM Credentials
            WHERE username = ?
        `,
        [ username ]);
        if (credentialLookup.length == 0) {
            /* Username is not stored in the DB, so authorization fails.*/
            return res.sendStatus(401);
        }

        const employeeId = credentialLookup[0].employee_id;
        const salt = credentialLookup[0].salt;
        const saltedHash = credentialLookup[0].salted_hash;
        const isAdmin = credentialLookup[0].is_admin;
        const isRaspi = credentialLookup[0].is_raspi;

        const loginResult = await verifyPassword(password, salt, saltedHash);
        
        if (loginResult) {
            const employeeLookup = await query(`
                SELECT employee_firstname, employee_lastname FROM Employee
                WHERE employee_id = ?
            `,
            [ employeeId ]);

            const firstName = employeeLookup[0].employee_firstname;
            const lastName = employeeLookup[0].employee_lastname;
            
            const managerLookup = await query(`
                SELECT manager_id FROM Manager
                WHERE employee_id = ?
            `,
            [ employeeId ]);

            const permissions = [];
            if (isAdmin) {
                permissions.push('admin');
            }
            if (isRaspi) {
                permissions.push('raspi');
            }
            if (managerLookup.length === 1) {
                permissions.push('manager');
            }

            const payload = {
                employeeId: employeeId,
                firstName: firstName,
                lastName: lastName,
                permissions: permissions
            };

            const jwt = await buildJWT(payload, isRaspi ? null : 60 * 60 * 16);

            return res.clearCookie('access_token').cookie('access_token', jwt, {
                httpOnly: true,
                secure: true
            }).sendStatus(200);
        } else {
            return res.sendStatus(401);
        }

    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

module.exports = router;
