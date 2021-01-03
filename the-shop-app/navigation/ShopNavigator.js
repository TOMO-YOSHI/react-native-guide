import { createStackNavigator } from "react-navigation-stack";
import { Platform } from "react-native";

import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import colors from "../constants/colors";
import { createAppContainer } from "react-navigation";

const ProductNavigator = createStackNavigator(
    {
        ProductsOverview: ProductsOverviewScreen,
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor:
                    Platform.OS === "android" ? colors.primary : "",
            },
            headerTintColor:
                Platform.OS === "android" ? "white" : colors.primary,
        },
    }
);

export default createAppContainer(ProductNavigator);
