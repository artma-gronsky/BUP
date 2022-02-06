import {GlobalActionTypes} from "./global.types";

export class SetGlobalLoading {
    public type: string = GlobalActionTypes.SET_LOADING;
    public payload: boolean;

    constructor(isLoading: boolean) {
        this.payload = isLoading;
    }
}


export type GlobalActions = SetGlobalLoading;