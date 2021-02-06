let express = require("express");
let app = express();

const promise_mysql = require("promise-mysql");
const connectionPoolPromise = require("../db/connection.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");

app.set("accessSecretKey", config.accessTokenSecret);
app.set("refreshSecretKey", config.refreshTokenSecret);

const refreshTokensList = [];

// Signup **************************************

exports.signup = (req, res) => {
    const { user_name, password } = req.body;
    let hashed_password = bcrypt.hashSync(password, 10);

    connectionPoolPromise
        .then(async (pool) => {
            const isUserExist = await pool
                .query(
                    `
            select * from users where user_name like '%${user_name}%';
            `
                )
                .then((results) => {
                    return results;
                });

            // console.log(isUserExist);

            if (isUserExist.length > 0) {
                res.send({ message: "This email address is already used." });
                return;
            }

            pool.query(
                `
                INSERT INTO users (user_name, password) VALUES 
                ( ${promise_mysql.escape(user_name)}, '${hashed_password}');
            `
            )
                .then((results) => {
                    const payload = {
                        user_id: results.insertId,
                        user_name: user_name,
                    };
                    const accessToken = jwt.sign(
                        payload,
                        app.get("accessSecretKey"),
                        {
                            expiresIn: config.accessTokenLife,
                        }
                    );
                    const refreshToken = jwt.sign(
                        payload,
                        app.get("refreshSecretKey"),
                        {
                            expiresIn: config.refreshTokenLife,
                        }
                    );

                    refreshTokensList.push(refreshToken);
                    res.status(200).send({
                        success: true,
                        user_id: results.insertId,
                        accessToken,
                        refreshToken,
                        accessExpiresIn: parseInt(config.accessTokenLife),
                        refreshExpiresIn: parseInt(config.refreshTokenLife),
                    });
                })
                .catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                });
        })
        .catch((err) => console.log(err));
};

// Login **************************************

exports.login = (req, res) => {
    const { user_name, password } = req.body;

    connectionPoolPromise
        .then((pool) => {
            pool.query(
                `
            select * from users where user_name like '%${user_name}%';
        `
            )
                .then((results) => {
                    if (!bcrypt.compareSync(password, results[0].password)) {
                        res.send({
                            success: false,
                            message: "Your email or password is wrong.",
                        });
                    } else {
                        // Issue token
                        const payload = {
                            user_id: results[0].user_id,
                            user_name: results[0].user_name,
                        };
                        // console.log(payload);
                        const accessToken = jwt.sign(
                            payload,
                            app.get("accessSecretKey"),
                            { expiresIn: config.accessTokenLife }
                        );
                        const refreshToken = jwt.sign(
                            payload,
                            app.get("refreshSecretKey"),
                            { expiresIn: config.refreshTokenLife }
                        );

                        refreshTokensList.push(refreshToken);

                        res.status(200).json({
                            success: true,
                            user_id: results[0].user_id,
                            accessToken,
                            refreshToken,
                            accessExpiresIn:
                                new Date().getTime() +
                                parseInt(config.accessTokenLife) * 1000,
                            refreshExpiresIn:
                                new Date().getTime() +
                                parseInt(config.refreshTokenLife) * 1000,
                        });
                    }
                    // res.send(results);
                })
                .catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                });
        })
        .catch((err) => console.log(err));
};

// Refresh Token **********************************

exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;

    jwt.verify(refreshToken, config.refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        const refreshedUser = {
            user_id: user.user_id,
            user_name: user.user_name,
        };
        const accessToken = jwt.sign(
            refreshedUser,
            app.get("accessSecretKey"),
            {
                expiresIn: config.accessTokenLife,
            }
        );
        const refreshToken = jwt.sign(
            refreshedUser,
            app.get("refreshSecretKey"),
            { expiresIn: config.refreshTokenLife }
        );
        const response = {
            success: "true",
            accessToken,
            refreshToken,
            accessExpiresIn:
                new Date().getTime() + parseInt(config.accessTokenLife) * 1000,
            refreshExpiresIn:
                new Date().getTime() + parseInt(config.refreshTokenLife) * 1000,
        };

        res.status(200).json(response);
    });
};
