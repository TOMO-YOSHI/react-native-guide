import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            // any async code you want!
            const resData = await fetch(`http://localhost:8080/api/products`)
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

            const loadedProducts = [];

            resData.forEach((el) => {
                const id = el.product_id;
                const { ownerId, title, imageUrl, description, price } = el;
                loadedProducts.push(
                    new Product(
                        id,
                        ownerId,
                        title,
                        imageUrl,
                        description,
                        price
                    )
                );

                dispatch({
                    type: SET_PRODUCTS,
                    products: loadedProducts,
                    userProducts: loadedProducts.filter(
                        (prod) => prod.ownerId === userId
                    ),
                });
            });
        } catch (error) {
            // send to custom analytics server
            throw error;
        }
    };
};

export const deleteProduct = (productId) => {
    return async (dispatch, getState) => {
        try {
            // any async code you want!
            const token = getState().auth.token;
            await fetch(
                `http://localhost:8080/api/products/${productId}?token=${token}`,
                {
                    method: "DELETE",
                }
            )
                .then((response) => {
                    return response.json();
                })
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    throw new Error("Something went wrong!");
                });

            dispatch({ type: DELETE_PRODUCT, pid: productId });
        } catch (error) {
            // send to custom analytics server
            throw error;
        }
    };
};

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        try {
            // any async code you want!
            const token = getState().auth.token;
            const userId = getState().auth.userId;
            const resData = await fetch(
                `http://localhost:8080/api/products?token=${token}`,
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
            )
                .then((response) => {
                    return response.json();
                })
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    throw new Error("Something went wrong!");
                });

            dispatch({
                id: resData.product_id,
                type: CREATE_PRODUCT,
                productData: {
                    title,
                    description,
                    imageUrl,
                    price,
                    ownerId: userId,
                },
            });
        } catch (error) {
            // send to custom analytics server
            throw error;
        }
    };
};

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        // any async code you want!
        try {
            await fetch(
                `http://localhost:8080/api/products/${id}?token=${token}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, description, imageUrl }),
                }
            ).catch((err) => {
                throw new Error("Something went wrong!");
            });

            // const resData = await response.json();

            console.log(imageUrl);

            dispatch({
                type: UPDATE_PRODUCT,
                pid: id,
                productData: { title, description, imageUrl },
            });
        } catch (error) {
            // send to custom analytics server
            throw error;
        }
    };
};
