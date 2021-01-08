import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";

import colors from "../constants/colors";
import { createAppContainer } from "react-navigation";

const defaultNavigationOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === "android" ? colors.primary : "",
    },
    headerTitleStyle: {
        fontFamily: "open-sans-bold",
    },
    headerBackTitleStyle: {
        fontFamily: "open-sans",
    },
    headerTintColor: Platform.OS === "android" ? "white" : colors.primary,
};

const ProductNavigator = createStackNavigator(
    {
        ProductsOverview: ProductsOverviewScreen,
        ProductDetail: ProductDetailScreen,
        Cart: CartScreen,
    },
    {
        navigationOptions: {
            drawerIcon: (drawerConfig) => (
                <Ionicons
                    name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
                    size={23}
                    color={drawerConfig.tintColor}
                />
            ),
        },
        defaultNavigationOptions: defaultNavigationOptions,
    }
);

const OrdersNavigator = createStackNavigator(
    {
        Orders: OrdersScreen,
    },
    {
        navigationOptions: {
            drawerIcon: (drawerConfig) => (
                <Ionicons
                    name={Platform.OS === "android" ? "md-list" : "ios-list"}
                    size={23}
                    color={drawerConfig.tintColor}
                />
            ),
        },
        defaultNavigationOptions: defaultNavigationOptions,
    }
);

const ShopNavigator = createDrawerNavigator(
    {
        Products: ProductNavigator,
        Orders: OrdersNavigator,
    },
    {
        contentOptions: {
            activeTintColor: colors.primary,
        },
    }
);

export default createAppContainer(ShopNavigator);
