import {GlobalActions} from "./global.actions";
import {GlobalActionTypes} from "./global.types";

export interface GlobalReducerInitialStateInterface{
    isLoading: boolean
}

export const initialState : GlobalReducerInitialStateInterface =  {
    isLoading: false
}

export default function globalReducer(state : GlobalReducerInitialStateInterface, action: GlobalActions){
    switch (action.type){
        case GlobalActionTypes.SET_LOADING:
            return {...state, isLoading: action.payload};
        default:
            return state;
    }
}