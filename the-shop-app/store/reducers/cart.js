import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/order";
import CartItem from "../../models/cart-item";
import { DELETE_PRODUCTS } from "../actions/products";

const initialState = {
    items: {},
    totalAmount: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;

            let updatedOrNewCartItem;

            if (state.items[addedProduct.id]) {
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice
                );
            } else {
                updatedOrNewCartItem = new CartItem(
                    1,
                    prodPrice,
                    prodTitle,
                    prodPrice
                );
            }
            return {
                ...state,
                items: {
                    ...state.items,
                    [addedProduct.id]: updatedOrNewCartItem,
                },
                totalAmount: state.totalAmount + prodPrice,
            };
        case REMOVE_FROM_CART:
            const pid = action.pid;
            const selectedItem = state.items[pid];
            const quantity = selectedItem.quantity;
            const price = selectedItem.productPrice;
            let newItems = { ...state.items };
            if (quantity === 1) {
                delete newItems[pid];
            } else {
                const updatedCartItem = new CartItem(
                    selectedItem.quantity - 1,
                    price,
                    selectedItem.productTitle,
                    selectedItem.sum - price
                );
                newItems = {
                    ...newItems,
                    [pid]: updatedCartItem,
                };
            }
            return {
                ...state,
                items: {
                    ...newItems,
                },
                totalAmount: Math.abs(state.totalAmount - price),
            };
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCTS:
            if (!state.items[action.pid]) {
                return state;
            }
            const updatedItems = { ...state.items };
            const itemTotal = state.items[action.pid].sum;
            delete updatedItems[action.pid];
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal,
            };
    }
    return state;
};
