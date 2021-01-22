let express = require("express");
let app = express();
let path = require("path");

app.set("port", process.env.PORT || 8080);

let server = app.listen(app.settings.port, () => {
    console.log("Server ready on", app.settings.port);
});

// app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// app.get('/', (req, res)=>{
//     res.sendFile(path.join(__dirname, 'public/', 'index.html'));
// })

const router = require("./routes/index.js");
app.use("/api", router);
