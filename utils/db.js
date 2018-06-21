const fs = require('fs');
const mysql = require('promise-mysql');

async function initdb() {
    const DBHOST = process.env['DBHOST']
    const DBUSER = process.env['DBUSER']
    const DBPASS = process.env['DBPASS']
    const initDBconnection = await mysql.createConnection({
        host                : DBHOST,
        user                : DBUSER,
        password            : DBPASS,
        multipleStatements  : true
    });
    const initDBscript = fs.readFileSync('initdb.sql', 'utf8')
    await initDBconnection.query(initDBscript);
    await initDBconnection.end();

    return pool = mysql.createPool({
        connectionLimit     : 10,
        host                : DBHOST,
        user                : DBUSER,
        password            : DBPASS,
        database            : 'ptdb'
    });
}

function makeQuerier(poolPromise) {
    const query = (sql, args) => {
        return poolPromise.then((pool) => {
            return pool.query(sql, args);
        });
    }
    return query
}

module.exports = makeQuerier(initdb());
