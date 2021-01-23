let express = require("express");
let app = express();
// let path = require("path");
const bodyParser = require("body-parser");
const promise_mysql = require("promise-mysql");
const jwt = require("jsonwebtoken");

const connectionPoolPromise = require("./db/connection");
const config = require("./config");
const VerifyToken = require("./middlewares/verifyToken");

app.set("port", process.env.PORT || 8080);

let server = app.listen(app.settings.port, () => {
    console.log("Server ready on", app.settings.port);
});

// app.use(express.static('public'));

// app.use(express.urlencoded({ extended: true }));
app.set("secretKey", config.secret);
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

    connectionPoolPromise
        .then((pool) => {
            pool.query(
                `
            INSERT INTO users (user_name, password) VALUES 
            ( ${promise_mysql.escape(user_name)}, ${promise_mysql.escape(
                    password
                )});
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
                            password: `${password}`,
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
                    if (results[0].password != password) {
                        res.json({
                            success: false,
                            message: "Your email or password is wrong.",
                        });
                    } else {
                        // Issue token
                        const payload = {
                            user_name: results[0].user_name,
                        };
                        const token = jwt.sign(payload, app.get("secretKey"));

                        res.json({
                            success: true,
                            token: token,
                        });
                    }
                    res.send(results);
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
    connectionPoolPromise
        .then((pool) => {
            pool.query(
                `
                select * from users where user_name like '%${req.decoded.user_name}%';
            `
            )
                .then((results) => {
                    res.status(200).send(results);
                })
                .catch((err) => {
                    res.status(500).send(
                        "Failed in the authentication process"
                    );
                });
        })
        .catch((error) => console.log(error));
});
