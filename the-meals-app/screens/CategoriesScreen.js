import React from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from "react-native";

import { CATEGORIES } from "../data/dummy-data";
import colors from "../constants/colors";

const CategoriesScreen = (props) => {
    // console.log(props);
    const renderGridItem = (itemData) => {
        return (
            <TouchableOpacity
                style={styles.gridItem}
                onPress={() =>
                    props.navigation.navigate({
                        routeName: "CategoryMeals",
                        params: { categoryId: itemData.item.id },
                    })
                }
            >
                <View>
                    <Text>{itemData.item.title}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={CATEGORIES}
            renderItem={renderGridItem}
            numColumns={2}
        />
        // <View style={styles.screen}>
        //     <Text>The Categories Screen</Text>
        //     <Button
        //         title="Go to Meals!"
        //         onPress={() => {
        //             // props.navigation.navigate({ routeName: "CategoryMeals" });
        //             // props.navigation.push("CategoryMeals");
        //             // props.navigation.replace("CategoryMeals");
        //         }}
        //     />
        // </View>
    );
};

CategoriesScreen.navigationOptions = {
    headerTitle: "Meal Categories",
    // headerStyle: {
    //     backgroundColor: Platform.OS === "android" ? colors.primaryColor : "",
    // },
    // headerTintColor: Platform.OS === "android" ? "white" : colors.primaryColor,
};

export default CategoriesScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    gridItem: {
        flex: 1,
        margin: 15,
        height: 150,
    },
});
