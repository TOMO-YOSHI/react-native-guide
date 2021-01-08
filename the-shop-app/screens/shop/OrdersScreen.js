import React from "react";
import { Text, StyleSheet, FlatList, Platform } from "react-native";
import { useSelector } from "react-redux";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";

const OrdersScreen = (props) => {
    const orders = useSelector((state) => state.orders.orders);
    return (
        <FlatList
            data={orders}
            renderItem={(itemData) => (
                <OrderItem
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                />
            )}
        />
    );
};

OrdersScreen.navigationOptions = (navData) => {
    return {
        headerTitle: "Your Orders",
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
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default OrdersScreen;
