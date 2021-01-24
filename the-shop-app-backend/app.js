let express = require("express");
let app = express();
// let path = require("path");
const bodyParser = require("body-parser");
const promise_mysql = require("promise-mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const connectionPoolPromise = require("./db/connection");
const config = require("./config");
const VerifyToken = require("./middlewares/verifyToken");

const refreshTokensList = [];

app.set("port", process.env.PORT || 8080);

let server = app.listen(app.settings.port, () => {
    console.log("Server ready on", app.settings.port);
});

// app.use(express.static('public'));

// app.use(express.urlencoded({ extended: true }));
app.set("accessSecretKey", config.accessTokenSecret);
app.set("refreshSecretKey", config.refreshTokenSecret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// app.get('/', (req, res)=>{
//     res.sendFile(path.join(__dirname, 'public/', 'index.html'));
// })

// const router = require("./routes/index.js");
// app.use("/api", router);

// POST USER ***********************************

app.post("/api/users", (req, res) => {
    const { user_name, password } = req.body;
    // console.log(req);
    let hashed_password = bcrypt.hashSync(password, 10);
    // console.log(hashed_password);

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
                    console.log("Successfully inserted a new row!");
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
        .catch((error) => console.log(error));
});

// GET USER ***********************************

app.get("/api/users", (req, res) => {
    // const { user_name, password } = req.body;
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
        .catch((error) => console.log(error));
});

// Signup **************************************

app.post("/api/signup", (req, res) => {
    const { user_name, password } = req.body;
    // console.log(req);
    let hashed_password = bcrypt.hashSync(password, 10);
    // console.log(hashed_password);

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
                    // res.set(
                    //     "content-location",
                    //     `localhost:8080/api/users/${results.insertId}`
                    // );
                    console.log("Successfully inserted a new row!");
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
                    res.status(201).json({
                        success: true,
                        accessToken,
                        refreshToken,
                        // acess_expires_in: config.accessTokenLife,
                        // refresh_expires_in: config.refreshTokenLife,
                        acess_expires_in:
                            new Date().getTime() +
                            parseInt(config.accessTokenLife) * 1000,
                        refresh_expires_in:
                            new Date().getTime() +
                            parseInt(config.refreshTokenLife) * 1000,
                    });
                    // res.status(201).send({
                    //     url: `/api/users/${results.insertId}`,
                    //     data: {
                    //         user_id: `${results.insertId}`,
                    //         user_name: `${user_name}`,
                    //     },
                    // });
                })
                .catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                    // res.status(500).send(err.message);
                });
        })
        .catch((error) => console.log(error));
});

// Login **************************************

app.post("/api/login", (req, res) => {
    const { user_name, password } = req.body;

    // console.log(user_name);

    connectionPoolPromise
        .then((pool) => {
            pool.query(
                `
            select * from users where user_name like '%${user_name}%';
        `
            )
                .then((results) => {
                    // console.log(
                    //     bcrypt.compareSync(password, results[0].password)
                    // );
                    // if (results[0].password != password) {
                    if (!bcrypt.compareSync(password, results[0].password)) {
                        res.json({
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

                        res.json({
                            success: true,
                            accessToken,
                            refreshToken,
                            // acess_expires_in: config.accessTokenLife,
                            // refresh_expires_in: config.refreshTokenLife,
                            acess_expires_in:
                                new Date().getTime() +
                                parseInt(config.accessTokenLife) * 1000,
                            refresh_expires_in:
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
        .catch((error) => console.log(error));
});

// VerifyToken **********************************

app.get("/api/verify", VerifyToken, (req, res, next) => {
    // Write a process that you want to run after verification below:

    connectionPoolPromise
        .then((pool) => {
            pool.query(
                `
                select * from users where user_name like '%${req.decoded.user_name}%';
            `
            )
                .then((results) => {
                    // res.status(200).send(results);
                    res.status(200).send(`Hello! ${results[0].user_name}!`);
                })
                .catch((err) => {
                    res.status(500).send(
                        "Failed in the authentication process"
                    );
                });
        })
        .catch((error) => console.log(error));
});

// Refresh Token **********************************

app.post("/api/token", (req, res) => {
    const { refreshToken } = req.body;

    // if refresh token exists
    if (refreshToken && refreshTokensList.includes(refreshToken)) {
        jwt.verify(refreshToken, config.refreshTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            const refreshedUser = {
                user_id: user.user_id,
                user_name: user.user_name,
            };
            const accessToken = jwt.sign(
                app.get("accessSecretKey"),
                config.accessTokenSecret,
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
            };

            res.status(200).json(response);
        });
    } else {
        res.status(404).send("Invalid request");
    }
});

// app.post("/api/products", VerifyToken, (req, res) => {
//     connectionPoolPromise.then((pool) => {
//         pool.query(`
//         INSERT INTO products (user_name, password) VALUES
//         ( ${promise_mysql.escape(user_name)}, '${hashed_password}');
// `)
//     });
// });
