let express = require("express");
let app = express();
const bodyParser = require("body-parser");

app.set("port", process.env.PORT || 8080);

app.listen(app.settings.port, () => {
    console.log("Server ready on", app.settings.port);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const router = require("./routes/index");
app.use("/api", router);

// *******************************
// VerifyToken Test Code
// *******************************

// const VerifyToken = require("./middlewares/verifyToken");

// app.get("/api/verify", VerifyToken, (req, res, next) => {
//     // Write a process that you want to run after verification below:

//     connectionPoolPromise
//         .then((pool) => {
//             pool.query(
//                 `
//                 select * from users where user_name like '%${req.decoded.user_name}%';
//             `
//             )
//                 .then((results) => {
//                     // res.status(200).send(results);
//                     res.status(200).send(`Hello! ${results[0].user_name}!`);
//                 })
//                 .catch((err) => {
//                     res.status(500).send(
//                         "Failed in the authentication process"
//                     );
//                 });
//         })
//         .catch((err) => console.log(err));
// });
