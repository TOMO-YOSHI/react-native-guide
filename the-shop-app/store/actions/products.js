import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

import firebase from "../../constants/firebase";

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            // any async code you want!
            const response = await fetch(`${firebase.url}/products.json`);

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const resData = await response.json();
            const loadedProducts = [];

            for (const key in resData) {
                loadedProducts.push(
                    new Product(
                        key,
                        resData[key].ownerId,
                        resData[key].title,
                        resData[key].imageUrl,
                        resData[key].description,
                        resData[key].price
                    )
                );

                dispatch({
                    type: SET_PRODUCTS,
                    products: loadedProducts,
                    userProducts: loadedProducts.filter(
                        (prod) => prod.ownerId === userId
                    ),
                });
            }

            // dispatch({ type: SET_PRODUCTS, products: [] });
        } catch (error) {
            // send to custom analytics server
            throw error;
        }
    };
};

export const deleteProduct = (productId) => {
    return async (dispatch, getState) => {
        // any async code you want!
        const token = getState().auth.token;
        const response = await fetch(
            `${firebase.url}/products/${productId}.json?auth=${token}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            throw new Error("Something went wrong!");
        }

        dispatch({ type: DELETE_PRODUCT, pid: productId });
    };
};

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        // any async code you want!
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(
            `${firebase.url}/products.json?auth=${token}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl,
                    price,
                    ownerId: userId,
                }),
            }
        );

        const resData = await response.json();

        // console.log(resData);

        dispatch({
            id: resData.name,
            type: CREATE_PRODUCT,
            productData: {
                title,
                description,
                imageUrl,
                price,
                ownerId: userId,
            },
        });
    };
};
// export const createProduct = (title, description, imageUrl, price) => {
//     return {
//         type: CREATE_PRODUCT,
//         productData: { title, description, imageUrl, price },
//     };
// };

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        // any async code you want!
        const response = await fetch(
            `${firebase.url}/products/${id}.json?auth=${token}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, imageUrl }),
            }
        );

        if (!response.ok) {
            throw new Error("Something went wrong!");
        }

        // const resData = await response.json();

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: { title, description, imageUrl },
        });
    };
};
