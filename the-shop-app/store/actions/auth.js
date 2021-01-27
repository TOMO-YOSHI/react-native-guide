import { AsyncStorage } from "react-native";

// export const SIGNUP = "SIGNUP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

import firebase from "../../constants/firebase";

let timer;

export const authenticate = (userId, token, expiryTime) => {
    return (dispatch) => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({ type: AUTHENTICATE, userId: userId, token: token });
    };
};

export const signup = (email, password) => {
    return async (dispatch) => {
        const response = await fetch(`http://localhost:8080/api/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_name: email,
                password: password,
            }),
        })
            .then((response) => {
                // console.log("response", response);
                return response.json();
            })
            .then((result) => {
                // console.log("result", result);
                return result;
            });

        // console.log(response);

        if (!response.success) {
            // const errorResData = await response.json();
            // const errorId = errorResData.error.message;
            let message = "Something went wrong!";
            // if (errorId === "EMAIL_NOT_FOUND") {
            //     message = "This email could not be found!";
            // } else if (errorId === "INVALID_PASSWORD") {
            //     message = "This password is not valid!";
            // }
            throw new Error(message);
        }

        const resData = response;
        // console.log(resData);
        dispatch(
            authenticate(
                resData.user_id,
                resData.accessToken,
                parseInt(resData.accessExpiresIn) * 1000
            )
        );
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.accessExpiresIn) * 1000
        );
        saveDataToStorage(resData.accessToken, resData.user_id, expirationDate);
    };
};

export const login = (email, password) => {
    return async (dispatch) => {
        const response = await fetch(`http://localhost:8080/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_name: email,
                password: password,
            }),
        })
            .then((response) => {
                // console.log("response", response);
                return response.json();
            })
            .then((result) => {
                // console.log("result", result);
                return result;
            })
            .catch((err) => {
                throw new Error("Something went wrong!");
            });

        // console.log(response);

        if (!response.success) {
            // const errorResData = await response.json();
            // const errorId = errorResData.error.message;
            let message = "Something went wrong!";
            // if (errorId === "EMAIL_NOT_FOUND") {
            //     message = "This email could not be found!";
            // } else if (errorId === "INVALID_PASSWORD") {
            //     message = "This password is not valid!";
            // }
            throw new Error(message);
        }

        const resData = response;
        // console.log(resData);
        dispatch(
            authenticate(
                resData.user_id,
                resData.accessToken,
                parseInt(resData.accessExpiresIn) * 1000
            )
        );
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.accessExpiresIn) * 1000
        );
        saveDataToStorage(resData.accessToken, resData.user_id, expirationDate);
    };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem("userData");
    return {
        type: LOGOUT,
    };
};

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const setLogoutTimer = (expirationTime) => {
    return (dispatch) => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem(
        "userData",
        JSON.stringify({
            token: token,
            userId: userId,
            expiryDate: expirationDate.toISOString(),
        })
    );
};
