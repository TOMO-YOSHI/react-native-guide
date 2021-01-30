const promise_mysql = require("promise-mysql");
const connectionPoolPromise = require("../db/connection.js");

// POST a product **********************************

exports.postProducts = (req, res) => {
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
                    res.send({
                        success: true,
                        product_id: results.insertId,
                    });
                })
                .catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                });
        })
        .catch((err) => console.log(err));
};

// GET products **********************************

exports.getProducts = (req, res) => {
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
};

// Delete a product **********************************

exports.deleteProducts = (req, res) => {
    const product_id = req.params.product_id;

    connectionPoolPromise.then(async (pool) => {
        pool.query(
            `
                delete from products where product_id = ${promise_mysql.escape(
                    product_id
                )};
                `
        )
            .then((results) => {
                res.send({
                    success: true,
                    message: `Deleted the product id of which is ${product_id}`,
                });
            })
            .catch((err) => {
                console.log(err);
                res.send(err.message);
            });
    });
};

// Update a product **********************************

exports.updateProducts = (req, res) => {
    const product_id = req.params.product_id;
    const { title, imageUrl, description } = req.body;

    connectionPoolPromise.then((pool) => {
        pool.query(
            `
            update products
            set
                title = ${promise_mysql.escape(title)},
                imageUrl = ${promise_mysql.escape(imageUrl)},
                description = ${promise_mysql.escape(description)}
            where
                product_id = ${promise_mysql.escape(product_id)};
            `
        )
            .then((results) => {
                res.send({
                    success: true,
                    message: `Updated the product id of which is ${product_id}`,
                });
            })
            .catch((err) => {
                console.log(err);
                res.send(err.message);
            });
    });
};
