const connectionPoolPromise = require("./connection.js");

connectionPoolPromise
    .then((pool) => {
        console.log("connected!");

        pool.query(
            `
            DROP TABLE IF EXISTS products_orders, products, orders, users;
            CREATE TABLE users (
                user_id     int             AUTO_INCREMENT,
                user_name   varchar(255)    NOT NULL,
                password    varchar(255)    NOT NULL,
                PRIMARY KEY (user_id)
            );
            CREATE TABLE orders (
                order_id    int     AUTO_INCREMENT,
                user_id     int,
                data        datetime,
                PRIMARY KEY (order_id),
                FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
            );
            CREATE TABLE products (
                product_id      int             AUTO_INCREMENT,
                title           varchar(255)    NOT NULL,
                price           double          NOT NULL,
                imageUrl        text,
                description     varchar(255),
                PRIMARY KEY (product_id)
            );
            CREATE TABLE products_orders (
                product_id  int,
                order_id    int,
                amount      int,
                PRIMARY KEY (product_id, order_id),
                FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
            );
            `
        )
            .then((results) => {
                console.log("succeeded to create a view!");
                console.log(results);
            })
            .catch((error) => console.log(error));
    })
    .catch((error) => console.log("error: ", error));

// CREATE TABLE orders (
//     order_id    int     AUTO_INCREMENT,
//     user_id     int,
//     data        datetime,
//     PRIMARY KEY (order_id),
//     FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
// );
// CREATE TABLE products (
//     product_id      int             AUTO_INCREMENT,
//     title           varchar(255)    NOT NULL,
//     price           double          NOT NULL,
//     imageUrl        vachar(512),
//     description     varchar(255),
//     PRIMARY KEY (product_id),
// );
// CREATE TABLE products_orders (
//     product_id  int,
//     order_id    int,
//     PRIMARY KEY (product_id, order_id),
//     FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
//     FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
// );
