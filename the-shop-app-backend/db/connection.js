require("dotenv").config();

const promise_mysql = require("promise-mysql");

const connectionPoolPromise = promise_mysql.createPool({
    // returns a promise
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
});

module.exports = connectionPoolPromise;
