import { Platform } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import CategoriesScreen from "../screens/CategoriesScreen";
import CategoryMealsScreen from "../screens/CategoryMealsScreen";
import MealDetailScreen from "../screens/MealDetailScreen";

import colors from "../constants/colors";
import MealDetailsScreen from "../screens/MealDetailScreen";

const MealsNavigator = createStackNavigator(
    {
        Categories: {
            screen: CategoriesScreen,
            // navigationOptions: {
            //     headerTitle: "Meals Categories!!!!",
            // },
        },
        CategoryMeals: {
            screen: CategoryMealsScreen,
            // navigationOptions: {
            //     headerStyle: {
            //         backgroundColor:
            //             Platform.OS === "android" ? colors.primaryColor : "",
            //     },
            //     headerTintColor:
            //         Platform.OS === "android" ? "white" : colors.primaryColor,
            // },
        },
        MealDetail: MealDetailsScreen,
    },
    {
        // mode: "modal", // Change page transition animation!!!
        // initialRouteName: "MealDetail", // Set initial Screen
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor:
                    Platform.OS === "android" ? colors.primaryColor : "",
            },
            headerTintColor:
                Platform.OS === "android" ? "white" : colors.primaryColor,
            headerTitle: "A Screen", // Over written by specific title
        },
    }
);

export default createAppContainer(MealsNavigator);
