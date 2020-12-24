import React from "react";
import { Text, StyleSheet } from "react-native";

const BodyText = (props) => (
  <Text style={{ ...styles.container, ...props.style }}>{props.children}</Text>
);
export default BodyText;

const styles = StyleSheet.create({
  container: {
    fontFamily: "open-sans",
  },
});
