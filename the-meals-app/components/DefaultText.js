import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DefaultText = (props) => (
    <Text style={styles.text}>{props.children}</Text>
);
export default DefaultText;

const styles = StyleSheet.create({
    text: {
        fontFamily: "open-sans",
    },
});
