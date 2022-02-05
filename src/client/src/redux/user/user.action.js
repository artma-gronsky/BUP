import {UserActionTypes} from "./user.types";

export const setCurrentUser = (user) => ({
    type: UserActionTypes.SET_USER,
    payload: user
});

export const setUserError = (err) => ({
    type: UserActionTypes.SET_ERROR,
    payload: err
})