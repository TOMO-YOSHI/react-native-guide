import React from "react";
import {
  View,
  Text,
  StyleSheet
} from "react-native";

const FiltersScreen = (props) => (
  <View style={styles.screen}>
    <Text>The Filters Screen</Text>
  </View>
)
export default FiltersScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});