import React from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

import { CATEGORIES, MEALS } from "../data/dummy-data";
import MealItem from "../components/MealItem";

const CategoryMealsScreen = (props) => {
    const renderMealItem = (itemData) => {
        return (
            <MealItem
                title={itemData.item.title}
                duration={itemData.item.duration}
                complexity={itemData.item.complexity}
                affordability={itemData.item.affordability}
                image={itemData.item.imageUrl}
                onSelectMeal={() => {
                    props.navigation.navigate({
                        routeName: "MealDetail",
                        params: { mealId: itemData.item.id },
                    });
                }}
            />
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
                style={{ width: "100%" }}
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
        padding: 15,
    },
});
