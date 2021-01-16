import React, { useReducer, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
    switch (action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid,
            };
        case INPUT_BLUR:
            return {
                ...state,
                touched: true,
            };
        default:
            return state;
    }
};

const Input = (props) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue ? props.initialValue : "",
        isValid: props.initialyValid,
        touched: false,
    });

    const { onInputChange, id } = props;
    // console.log(props);

    // useEffect(() => {
    //     console.log(inputState);
    // }, [inputState]);

    useEffect(() => {
        // if (inputState.touched) {
        console.log("onInputChange");
        console.log(id, inputState.value);
        onInputChange(id, inputState.value, inputState.isValid);
        // }
    }, [inputState]);
    // }, [inputState.value, inputState.isValid]);

    const textChangeHandler = (text) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        // if (props.email && !emailRegex.test(text.toLowerCase())) {
        //     isValid = false;
        // }
        if (props.min != null && +text < props.min) {
            isValid = false;
        }
        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }
        // console.log("input");
        // console.log({ type: INPUT_CHANGE, value: text, isValid: isValid });
        dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
    };

    const lostFocusHandler = () => {
        dispatch({ type: INPUT_BLUR });
    };

    return (
        <View style={styles.formControl}>
            <Text style={styles.label}>{props.label}</Text>
            <TextInput
                {...props}
                style={styles.input}
                value={inputState.value}
                onChangeText={(text) => textChangeHandler(text)}
                onBlur={lostFocusHandler}
                // onFocus={lostFocusHandler}
                // onEndEditing={() =>
                //     console.log("It will be fired when removing cursor")
                // }
                // onSubmitEditing={() =>
                //     console.log("It will be fired when a return button is hit")
                // }
            />
            {!inputState.isValid && inputState.touched && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{props.errorText}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    formControl: { width: "100%" },
    label: { fontFamily: "open-sans-bold", marginVertical: 8 },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
    },
    errorContainer: {
        marginVertical: 5,
    },
    errorText: {
        fontFamily: "open-sans",
        color: "red",
        fontSize: 13,
    },
});
export default Input;
