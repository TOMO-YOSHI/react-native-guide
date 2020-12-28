import React from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

import { CATEGORIES, MEALS } from "../data/dummy-data";

const CategoryMealsScreen = (props) => {
    const renderMealItem = (itemData) => {
        return (
            <View>
                <Text>{itemData.item.title}</Text>
            </View>
        );
    };

    const catId = props.navigation.getParam("categoryId");

    const displayedMeals = MEALS.filter(
        (meal) => meal.categoryIds.indexOf(catId) >= 0
    );

    const selectedCategory = CATEGORIES.find((cat) => cat.id === catId);

    return (
        <View style={styles.screen}>
            <FlatList
                data={displayedMeals}
                keyExtractor={(item, index) => item.id}
                renderItem={renderMealItem}
            />
            {/* <Text>The Category Meals Screen</Text>
            <Text>{selectedCategory.title}</Text>
            <Button
                title="Go to Details"
                onPress={() => {
                    props.navigation.navigate({ routeName: "MealDetail" });
                }}
            />
            <Button
                title="Go back"
                onPress={() => {
                    props.navigation.goBack();
                }}
            /> */}
        </View>
    );
};

CategoryMealsScreen.navigationOptions = (navigationData) => {
    // console.log(navigationData);
    const catId = navigationData.navigation.getParam("categoryId");

    const selectedCategory = CATEGORIES.find((cat) => cat.id === catId);

    return {
        headerTitle: selectedCategory.title,
    };
};

export default CategoryMealsScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
