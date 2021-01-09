export const DELETE_PRODUCTS = "DELETE_PRODUCTS";

export const deleteProduct = (productId) => {
    return { type: DELETE_PRODUCTS, pid: productId };
};
