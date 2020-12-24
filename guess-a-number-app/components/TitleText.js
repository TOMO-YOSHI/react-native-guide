import React from "react";
import { Text, StyleSheet } from "react-native";

const TitleText = (props) => (
  <Text style={{ ...styles.container, ...props.style }}>{props.children}</Text>
);
export default TitleText;

const styles = StyleSheet.create({
  container: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
});
