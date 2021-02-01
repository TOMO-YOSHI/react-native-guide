import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    FlatList,
    Platform,
    View,
    Text,
    ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";

import * as ordersActions from "../../store/actions/order";
import colors from "../../constants/colors";

const OrdersScreen = (props) => {
    const [isLoading, setIsLoading] = useState(true);

    const orders = useSelector((state) => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        // setIsLoading(true);
        dispatch(ordersActions.fetchOrders()).then(() => setIsLoading(false));
    }, [dispatch]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (orders.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No orders found, maybe start ordering some?</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={(itemData) => (
                <OrderItem
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                    items={itemData.item.items}
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
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default OrdersScreen;
