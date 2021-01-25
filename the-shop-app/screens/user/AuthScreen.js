import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    StyleSheet,
    Button,
    ActivityIndicator,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import colors from "../../constants/colors";

import * as authActions from "../../store/actions/auth";

const AuthScreen = (props) => {
    const [inputValues, setInputValues] = useState({
        email: "",
        password: "",
    });
    const [inputValidities, setInputValidities] = useState({
        email: false,
        password: false,
    });
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        // console.log("error!");
        // console.log(error);
        if (error) {
            Alert.alert("An error occured!", error, [{ text: "Okay" }]);
        }
    }, [error]);

    const authHandler = async () => {
        // console.log(inputValues);
        // console.log("===============");
        // console.log(inputValidities);
        try {
            if (inputValidities.email && inputValidities.password) {
                setIsLoading(true);
                if (isSignup) {
                    await dispatch(
                        authActions.signup(
                            inputValues.email,
                            inputValues.password
                        )
                    );
                    // console.log("Signup success!!!");
                    props.navigation.navigate("Shop");
                } else {
                    await dispatch(
                        authActions.login(
                            inputValues.email,
                            inputValues.password
                        )
                    );
                    // console.log("Login success!!!");
                    props.navigation.navigate("Shop");
                }
            }
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            setInputValues((state) => {
                return {
                    ...state,
                    [inputIdentifier]: inputValue,
                };
            });
            setInputValidities((state) => {
                return {
                    ...state,
                    [inputIdentifier]: inputValidity,
                };
            });
        },
        []
    );

    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <LinearGradient
                colors={["#ffedfd", "#ffe3ff"]}
                style={styles.gradient}
            >
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-Mail"
                            keyboardType="email-address"
                            required
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input
                            id="password"
                            label="Password"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={6}
                            autoCapitalize="none"
                            errorText="Please enter a valid password."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            {isLoading ? (
                                <ActivityIndicator
                                    size="small"
                                    color={colors.primary}
                                />
                            ) : (
                                <Button
                                    title={isSignup ? "Sign Up" : "Login"}
                                    color={colors.primary}
                                    onPress={authHandler}
                                />
                            )}
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={`Switch to ${
                                    isSignup ? "Login" : "Sign Up"
                                }`}
                                color={colors.accent}
                                onPress={() => {
                                    setIsSignup((state) => !state);
                                }}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

AuthScreen.navigationOptions = {
    headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    gradient: {
        // width: "100%",
        // height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    authContainer: {
        width: "80%",
        maxWidth: 400,
        // height: "50%",
        maxHeight: 400,
        padding: 20,
    },
    buttonContainer: {
        marginTop: 10,
    },
});

export default AuthScreen;
