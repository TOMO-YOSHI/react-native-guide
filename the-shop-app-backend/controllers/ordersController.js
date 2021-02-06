const promise_mysql = require("promise-mysql");
const connectionPoolPromise = require("../db/connection");

// POST new order **********************************

exports.postOrders = (req, res) => {
    const { cartItems, userId } = req.body;
    const date = new Date();
    let order_id;

    connectionPoolPromise
        .then(async (pool) => {
            order_id = await pool
                .query(
                    `
            INSERT INTO orders (user_id, date) VALUES (${promise_mysql.escape(
                userId
            )}, ${promise_mysql.escape(date)});
        `
                )
                .then((results) => {
                    return results.insertId;
                })
                .catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                });

            // console.log(order_id);

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
            res.status(200).send({
                id: order_id,
                date: date,
            });
        })
        .catch((err) => console.log(err));
};

// GET orders *************************************
exports.getOrders = (req, res) => {
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

                    res.status(200).json(orders);
                })
                .catch((err) => {
                    console.log(err.message);
                    res.send(err.message);
                });
        })
        .catch((err) => console.log(err));
};
