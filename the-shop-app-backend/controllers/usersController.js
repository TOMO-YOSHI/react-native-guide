const promise_mysql = require("promise-mysql");
const connectionPoolPromise = require("../db/connection.js");
const bcrypt = require("bcrypt");

// POST USER ***********************************

exports.postUsers = (req, res) => {
    const { user_name, password } = req.body;
    let hashed_password = bcrypt.hashSync(password, 10);

    connectionPoolPromise
        .then((pool) => {
            pool.query(
                `
            INSERT INTO users (user_name, password) VALUES 
            ( ${promise_mysql.escape(user_name)}, '${hashed_password}');
            `
            )
                .then((results) => {
                    res.set(
                        "content-location",
                        `localhost:8080/api/users/${results.insertId}`
                    );
                    res.status(201).send({
                        url: `/api/users/${results.insertId}`,
                        data: {
                            user_id: `${results.insertId}`,
                            user_name: `${user_name}`,
                            // password: `${password}`,
                        },
                    });
                })
                .catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                    // res.status(500).send(err.message);
                });
        })
        .catch((err) => console.log(err));
};

// GET USER ***********************************

exports.getUsers = (req, res) => {
    connectionPoolPromise
        .then((pool) => {
            pool.query(
                `
            SELECT * FROM the_shop_app.users;
        `
            )
                .then((results) => {
                    res.send(results);
                })
                .catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                });
        })
        .catch((err) => console.log(err));
};
