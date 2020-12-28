import React from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import { CATEGORIES } from "../data/dummy-data";
import CategoryGridTile from "../components/CategoryGridTile";

const CategoriesScreen = (props) => {
    // console.log(props);
    const renderGridItem = (itemData) => {
        return (
            <CategoryGridTile
                title={itemData.item.title}
                color={itemData.item.color}
                onSelect={() =>
                    props.navigation.navigate({
                        routeName: "CategoryMeals",
                        params: { categoryId: itemData.item.id },
                    })
                }
            />
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
});
