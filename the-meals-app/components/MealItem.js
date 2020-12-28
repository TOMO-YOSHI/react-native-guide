import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const MealItem = (props) => {
    return (
        <TouchableOpacity onPress={props.onSelectMeal}>
            <View>
                <View>
                    <Text>{itemData.item.title}</Text>
                </View>
                <View></View>
            </View>
        </TouchableOpacity>
    );
};
export default MealItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
