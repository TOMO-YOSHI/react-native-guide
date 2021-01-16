import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
    return async (dispatch) => {
        try {
            // any async code you want!
            const response = await fetch(
                "https://rn-complete-guide-854b9-default-rtdb.firebaseio.com/products.json"
            );

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const resData = await response.json();
            const loadedProducts = [];

            for (const key in resData) {
                loadedProducts.push(
                    new Product(
                        key,
                        "u1",
                        resData[key].title,
                        resData[key].imageUrl,
                        resData[key].description,
                        resData[key].price
                    )
                );

                dispatch({ type: SET_PRODUCTS, products: loadedProducts });
            }

            // dispatch({ type: SET_PRODUCTS, products: [] });
        } catch (error) {
            // send to custom analytics server
            throw error;
        }
    };
};

export const deleteProduct = (productId) => {
    return { type: DELETE_PRODUCT, pid: productId };
};

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch) => {
        // any async code you want!
        const response = await fetch(
            "https://rn-complete-guide-854b9-default-rtdb.firebaseio.com/products.json",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, imageUrl, price }),
            }
        );

        const resData = await response.json();

        // console.log(resData);

        dispatch({
            id: resData.name,
            type: CREATE_PRODUCT,
            productData: { title, description, imageUrl, price },
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
    return async (dispatch) => {
        // any async code you want!
        await fetch(
            `https://rn-complete-guide-854b9-default-rtdb.firebaseio.com/products/${id}.json`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, imageUrl }),
            }
        );

        // const resData = await response.json();

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: { title, description, imageUrl },
        });
    };
};
