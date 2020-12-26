import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView
} from "react-native";

import BodyText from "../components/BodyText";
import TitleText from "../components/TitleText";
import MainButton from "../components/MainButton";
import colors from "../constants/colors";

const GameOverScreen = (props) => (
  <ScrollView>
    <View style={styles.screen}>
      <TitleText>The Game is Over!</TitleText>
      <View style={styles.imageContainer}>
        <Image
          // fadeDuration={1000}
          style={styles.image}
          resizeMode="cover"
          source={require("../assets/images/success.png")}
        // source={{
        //   uri:
        //     "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
        // }}
        />
      </View>
      <View style={styles.resultContainer}>
        <BodyText style={styles.resultText}>
          Your phone needed{" "}
          <Text style={styles.highlight}>{props.roundsNumber}</Text> rounds to
          guess the number{" "}
          <Text style={styles.highlight}>{props.userNumber}</Text>.
        </BodyText>
        {/* <BodyText>Number of rounds: {props.roundsNumber}</BodyText>
    <BodyText>number was: {props.userNumber}</BodyText> */}
      </View>
      <MainButton onPress={props.onRestart}>NEW GAME</MainButton>
    </View>
  </ScrollView>
);
export default GameOverScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  imageContainer: {
    borderRadius: (Dimensions.get("window").width * 0.7) / 2,
    borderWidth: 3,
    borderColor: "black",
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").width * 0.7,
    overflow: "hidden",
    marginVertical: Dimensions.get("window").height / 30,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  resultContainer: {
    marginHorizontal: 20,
    marginVertical: Dimensions.get("window").height / 60,
  },
  resultText: {
    textAlign: "center",
    fontSize: Dimensions.get("window").height < 550 ? 16 : 20,
  },
  highlight: {
    color: colors.primary,
    fontFamily: "open-sans-bold",
  },
});
