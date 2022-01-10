import {UserActionTypes} from "./user.types";

export const userInitialState = {
    current: null,
    err: ''
};

export default function userReducer(state, action ){
    switch (action.type){
        case UserActionTypes.SET_USER:
            return {...state, current: action.payload}
        case UserActionTypes.SET_ERROR:
            return {...state, current: null, err: action.payload}
        default:
            return state;
    }
}