import React from "react";
import { Platform, Text } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createDrawerNavigator } from "react-navigation-drawer";

import CategoriesScreen from "../screens/CategoriesScreen";
import CategoryMealsScreen from "../screens/CategoryMealsScreen";
import MealDetailsScreen from "../screens/MealDetailScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import FiltersScreen from "../screens/FiltersScreen";

import colors from "../constants/colors";

const defaultStackNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === "android" ? colors.primaryColor : "",
    },
    headerTitleStyle: {
        fontFamily: "open-sans-bold",
    },
    headerBackTitleStyle: {
        fontFamily: "open-sans",
    },
    headerTintColor: Platform.OS === "android" ? "white" : colors.primaryColor,
    // headerTitle: "A Screen", // Over written by specific title
};

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
        defaultNavigationOptions: defaultStackNavOptions,
    }
);

const FavNavigator = createStackNavigator(
    {
        Favorites: FavoritesScreen,
        MealDetail: MealDetailsScreen,
    },
    {
        defaultNavigationOptions: defaultStackNavOptions,
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
            tabBarLabel:
                Platform.OS === "android" ? (
                    <Text style={{ fontFamily: "open-sans-bold" }}>
                        Favorites
                    </Text>
                ) : (
                    "Favorites"
                ),
        },
    },
    Favorites: {
        screen: FavNavigator,
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
            tabBarLabel:
                Platform.OS === "android" ? (
                    <Text style={{ fontFamily: "open-sans-bold" }}>Meals</Text>
                ) : (
                    "Meals"
                ),
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
                  labelStyle: {
                      fontFamily: "open-sans",
                  },
                  activeTintColor: colors.accentColor,
              },
          });

const FiltersNavigator = createStackNavigator(
    {
        Filters: FiltersScreen,
    },
    {
        // navigationOptions: {
        //     drawerLabel: "Filters!!!!!",
        // },
        defaultNavigationOptions: defaultStackNavOptions,
    }
);

const MainNavigator = createDrawerNavigator(
    {
        MealsFavs: {
            screen: MealsFavNavigator,
            navigationOptions: { drawerLabel: "Meals" },
        },
        Filters: FiltersNavigator,
    },
    {
        contentOptions: {
            activeTintColor: colors.accentColor,
            labelStyle: {
                fontFamily: "open-sans-bold",
            },
        },
    }
);

export default createAppContainer(MainNavigator);
