import { createStackNavigator } from "react-navigation-stack";
import { Platform } from "react-native";

import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import colors from "../constants/colors";
import { createAppContainer } from "react-navigation";

const ProductNavigator = createStackNavigator(
    {
        ProductsOverview: ProductsOverviewScreen,
        ProductDetail: ProductDetailScreen,
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor:
                    Platform.OS === "android" ? colors.primary : "",
            },
            headerTitleStyle: {
                fontFamily: "open-sans-bold",
            },
            headerBackTitleStyle: {
                fontFamily: "open-sans",
            },
            headerTintColor:
                Platform.OS === "android" ? "white" : colors.primary,
        },
    }
);

export default createAppContainer(ProductNavigator);
