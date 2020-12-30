import React from "react";
import { Platform } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import CategoriesScreen from "../screens/CategoriesScreen";
import CategoryMealsScreen from "../screens/CategoryMealsScreen";
import MealDetailsScreen from "../screens/MealDetailScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

import colors from "../constants/colors";

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

const tabScreenConfig = {
    Meals: {
        screen: MealsNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return (
                    <Ionicons
                        name="ios-restaurant"
                        size={25}
                        color={tabInfo.tintColor}
                    />
                );
            },
            tabBarColor: colors.primaryColor,
        },
    },
    Favorites: {
        screen: FavoritesScreen,
        navigationOptions: {
            // tabBarLabel: "Favorites!",
            tabBarIcon: (tabInfo) => {
                return (
                    <Ionicons
                        name="ios-star"
                        size={25}
                        color={tabInfo.tintColor}
                    />
                );
            },
            tabBarColor: colors.accentColor,
        },
    },
};

const MealsFavNavigator =
    Platform.OS === "android"
        ? createMaterialBottomTabNavigator(tabScreenConfig, {
              activeColor: "white",
              shifting: true,
              //   barStyle: {
              //       backgroundColor: colors.primaryColor,
              //   },
          })
        : createBottomTabNavigator(tabScreenConfig, {
              tabBarOptions: {
                  activeTintColor: colors.accentColor,
              },
          });

export default createAppContainer(MealsFavNavigator);
