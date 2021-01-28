import React from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    Button,
    StyleSheet,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../../store/actions/cart";

import colors from "../../constants/colors";

const ProductDetailScreen = (props) => {
    const productId = props.navigation.getParam("productId");
    const selectedProduct = useSelector((state) =>
        state.products.availableProducts.find(
            (product) => product.id === productId
        )
    );
    // console.log(selectedProduct);

    const dispatch = useDispatch();

    // The code below is needed to avoid the error!!!
    if (selectedProduct === undefined) {
        return <View></View>;
    }
    // **********************************************

    return (
        <ScrollView>
            <Image
                style={styles.image}
                source={{ uri: selectedProduct.imageUrl }}
            />
            <View style={styles.actions}>
                <Button
                    color={colors.primary}
                    title="Add to Cart"
                    onPress={() => {
                        dispatch(cartActions.addToCart(selectedProduct));
                    }}
                />
            </View>
            <Text style={styles.price}>
                ${selectedProduct.price.toFixed(2)}
            </Text>
            <Text style={styles.description}>
                {selectedProduct.description}
            </Text>
        </ScrollView>
    );
};

ProductDetailScreen.navigationOptions = (navData) => {
    return {
        headerTitle: navData.navigation.getParam("productTitle"),
    };
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 300,
    },
    actions: {
        marginVertical: 10,
        alignItems: "center",
    },
    price: {
        fontSize: 20,
        color: "#888",
        textAlign: "center",
        marginVertical: 20,
        fontFamily: "open-sans-bold",
    },
    description: {
        fontSize: 14,
        textAlign: "center",
        marginHorizontal: 20,
        fontFamily: "open-sans",
    },
});
