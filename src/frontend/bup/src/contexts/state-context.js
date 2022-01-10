import React, {createContext, useContext, useReducer} from 'react';
import logger from "use-reducer-logger";
import {rootReducer} from "../redux/root-reducer";
import {userInitialState} from "../redux/user/user.reducer";

export const StateContext = createContext();

export const StateProvider = ({children}) =>(
    <StateContext.Provider value={ useReducer((process.env.NODE_ENV === 'development' ? logger(rootReducer) : rootReducer),
        {user: userInitialState})}>
        {children}
    </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);

