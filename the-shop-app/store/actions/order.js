import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

import firebase from "../../constants/firebase";

export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const token = getState().auth.token;
        try {
            // any async code you want!
            const response = await fetch(
                `http://localhost:8080/api/orders?user_id=${userId}&token=${token}`
            )
                .then((response) => {
                    // console.log("response", response);
                    return response.json();
                })
                .then((result) => {
                    // console.log("result", result);
                    return result;
                })
                .catch((err) => {
                    throw new Error("Something went wrong!");
                });

            // if (!response.ok) {
            //     throw new Error("Something went wrong!");
            // }

            const resData = response;
            const loadedOrders = [];

            for (const key in resData) {
                loadedOrders.push(
                    new Order(
                        key,
                        resData[key].cartItems,
                        resData[key].totalAmount,
                        new Date(resData[key].date)
                    )
                );

                dispatch({ type: SET_ORDERS, orders: loadedOrders });
            }
        } catch (error) {
            // send to custom analytics server
            throw error;
        }
    };
};

export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const date = new Date();

        const response = await fetch(
            `http://localhost:8080/api/orders?token=${token}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cartItems,
                    totalAmount,
                    userId,
                }),
            }
        )
            .then((response) => {
                // console.log("response", response);
                return response.json();
            })
            .then((result) => {
                // console.log("result", result);
                return result;
            })
            .catch((err) => {
                throw new Error("Something went wrong!");
            });

        const resData = response;

        console.log(resData.id);

        dispatch({
            type: ADD_ORDER,
            orderData: {
                id: resData.id,
                items: cartItems,
                amount: totalAmount,
                date: date,
            },
        });
    };
};
