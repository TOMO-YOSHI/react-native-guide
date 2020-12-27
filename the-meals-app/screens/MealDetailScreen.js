import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const MealDetailsScreen = (props) => (
    <View style={styles.screen}>
        <Text>The Meal Details Screen</Text>
        <Button
            title="Go Back to Categories"
            onPress={() => {
                props.navigation.popToTop();
            }}
        />
    </View>
);
export default MealDetailsScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
