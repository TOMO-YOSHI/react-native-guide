import React, { useEffect } from "react";
import { FlatList, StyleSheet, Platform, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";
import HeaderButton from "../../components/UI/HeaderButton";

import colors from "../../constants/colors";

const ProductOverviewScreen = (props) => {
    const products = useSelector((state) => state.products.availableProducts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(productsActions.fetchProducts());
    }, [dispatch]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate("ProductDetail", {
            productId: id,
            productTitle: title,
        });
    };

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        selectItemHandler(
                            itemData.item.id,
                            itemData.item.title
                        );
                    }}
                    // onAddToCart={() => {
                    //     dispatch(cartActions.addToCart(itemData.item));
                    // }}
                >
                    <Button
                        color={colors.primary}
                        title="View Details"
                        onPress={() => {
                            selectItemHandler(
                                itemData.item.id,
                                itemData.item.title
                            );
                        }}
                    />
                    <Button
                        color={colors.primary}
                        title="To Cart"
                        onPress={() => {
                            dispatch(cartActions.addToCart(itemData.item));
                        }}
                    />
                </ProductItem>
            )}
        />
    );
};

ProductOverviewScreen.navigationOptions = (navData) => {
    return {
        headerTitle: "All Products",
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Menu"
                    iconName={
                        Platform.OS === "android" ? "md-menu" : "ios-menu"
                    }
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Cart"
                    iconName={
                        Platform.OS === "android" ? "md-cart" : "ios-cart"
                    }
                    onPress={() => {
                        navData.navigation.navigate("Cart");
                    }}
                />
            </HeaderButtons>
        ),
    };
};

export default ProductOverviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
