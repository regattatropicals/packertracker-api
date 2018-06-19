const express = require('express');
const router = express.Router();
const query = require('../db');

router.post('/', async (req, res, next) => {
    try {
        const results = await query(`
        SELECT salt, salted_hash FROM Credentials
        WHERE username = ?
        `,
        [req.body.username]);
        if (results.length == 0) {
            return res.sendStatus(401);
        }
        // TODO
    } catch(err) {
        next(err);
    }
});

module.exports = router;
