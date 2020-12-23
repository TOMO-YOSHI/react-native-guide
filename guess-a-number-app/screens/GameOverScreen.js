import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const GameOverScreen = (props) => (
  <View style={styles.screen}>
    <Text>The Game is Over!</Text>
    <Text>Number of rounds: {props.roundsNumber}</Text>
    <Text>number was: {props.userNumber}</Text>
    <Button title="NEW GAME" onPress={props.onRestart} />
  </View>
);
export default GameOverScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
