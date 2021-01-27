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
        .catch((err) => console.log(err));
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
        .catch((err) => console.log(err));
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
                        user_id: results.insertId,
                        accessToken,
                        refreshToken,
                        // accessExpiresIn: config.accessTokenLife,
                        // refreshExpiresIn: config.refreshTokenLife,
                        accessExpiresIn:
                            // new Date().getTime() +
                            // parseInt(config.accessTokenLife) * 1000,
                            parseInt(config.accessTokenLife),
                        refreshExpiresIn:
                            // new Date().getTime() +
                            // parseInt(config.refreshTokenLife) * 1000,
                            parseInt(config.refreshTokenLife),
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
        .catch((err) => console.log(err));
});

// Login **************************************

app.post("/api/login", (req, res) => {
    const { user_name, password } = req.body;

    // console.log(req.body);

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

                        res.status(200).send({
                            success: true,
                            user_id: results[0].user_id,
                            accessToken,
                            refreshToken,
                            // accessExpiresIn: config.accessTokenLife,
                            // refreshExpiresIn: config.refreshTokenLife,
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
        .catch((err) => console.log(err));
});

// Refresh Token **********************************

app.post("/api/token", (req, res) => {
    const { refreshToken } = req.body;

    // console.log(refreshToken);
    // console.log(refreshTokensList);

    // if refresh token exists
    // if (refreshToken && refreshTokensList.includes(refreshToken)) {
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
    // } else {
    //     res.status(404).send("Invalid request");
    // }
});

// POST a new product **********************************

app.post("/api/products", VerifyToken, (req, res) => {
    const { title, price, imageUrl, description, ownerId } = req.body;

    connectionPoolPromise
        .then((pool) => {
            pool.query(
                `
        INSERT INTO products (title, price, imageUrl, description, ownerId) VALUES
        ( ${promise_mysql.escape(title)}, ${promise_mysql.escape(
                    price
                )}, ${promise_mysql.escape(imageUrl)}, ${promise_mysql.escape(
                    description
                )}, ${promise_mysql.escape(ownerId)});`
            )
                .then((results) => {
                    res.send("Success to add a new product.");
                })
                .catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                });
        })
        .catch((err) => console.log(err));
});

// GET a new product **********************************

app.get("/api/products", (req, res) => {
    const ownerId = req.query.ownerId;

    let mysqlQuery;

    if (ownerId) {
        mysqlQuery = `SELECT * FROM the_shop_app.products WHERE ownerId = ${ownerId};`;
    } else {
        mysqlQuery = `SELECT * FROM the_shop_app.products;`;
    }

    connectionPoolPromise
        .then((pool) => {
            pool.query(mysqlQuery)
                .then((results) => {
                    res.status(200).json(results);
                })
                .catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                });
        })
        .catch((err) => console.log(err));
});

// POST a new order **********************************

app.post("/api/orders", VerifyToken, (req, res) => {
    const { cartItems, userId } = req.body;
    const date = new Date();
    let order_id;

    connectionPoolPromise
        .then(async (pool) => {
            const orderId = await pool
                .query(
                    `
            INSERT INTO orders (user_id, date) VALUES (${promise_mysql.escape(
                userId
            )}, ${promise_mysql.escape(date)});
        `
                )
                .then((results) => {
                    // console.log("test", results.insertId);
                    order_id = results.insertId;
                })
                .catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                });

            cartItems.forEach((element) => {
                const {
                    productId,
                    productTitle,
                    productPrice,
                    quantity,
                } = element;

                pool.query(
                    `
                    INSERT INTO products_orders (product_id, order_id, title, price, quantity) VALUES (${promise_mysql.escape(
                        productId
                    )}, ${promise_mysql.escape(
                        order_id
                    )}, ${promise_mysql.escape(
                        productTitle
                    )}, ${promise_mysql.escape(
                        productPrice
                    )}, ${promise_mysql.escape(quantity)});
                `
                ).catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                });
            });
            res.send({
                id: order_id,
                date: date,
            });
        })
        .catch((err) => console.log(err));
});

// GET orders
app.get("/api/orders", VerifyToken, (req, res) => {
    const user_id = req.query.user_id;

    connectionPoolPromise
        .then((pool) => {
            pool.query(
                `
                select
                    o.order_id,
                    date,
                    po.product_id,
                    po.title,
                    po.price,
                    po.quantity,
                    po.price * po.quantity sum
                from
                    orders o
                inner join
                    products_orders po
                    on o.order_id = po.order_id
                where o.user_id = ${user_id};
                `
            )
                .then((results) => {
                    const orders = {
                        [0]: {
                            cartItems: [
                                {
                                    productId: 0,
                                    productPrice: 0,
                                    productTitle: "dummy-data",
                                    quantity: 0,
                                    sum: 0,
                                },
                            ],
                            date: new Date(),
                            totalAmount: 0.0,
                        },
                    };

                    results.forEach((el) => {
                        // console.log(el);
                        // console.log(
                        //     Object.keys(orders).indexOf(
                        //         el.order_id.toString()
                        //     ) === -1
                        // );
                        if (
                            Object.keys(orders).indexOf(
                                el.order_id.toString()
                            ) === -1
                        ) {
                            orders[el.order_id] = {
                                cartItems: [
                                    {
                                        productId: el.product_id,
                                        productPrice: el.price,
                                        productTitle: el.title,
                                        quantity: el.quantity,
                                        sum: el.sum,
                                    },
                                ],
                                date: el.date,
                                totalAmount: el.sum,
                            };
                        } else {
                            orders[el.order_id].cartItems.push({
                                productId: el.product_id,
                                productPrice: el.price,
                                productTitle: el.title,
                                quantity: el.quantity,
                                sum: el.sum,
                            });
                            orders[el.order_id].totalAmount += el.sum;
                        }
                    });
                    delete orders[0];

                    // console.log(orders);

                    res.json(orders);
                })
                .catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                });
        })
        .catch((err) => console.log(err));
});
