import userReducer from "./user/user.reducer";

export const rootReducer = ({user}, action) => ({
    user: userReducer(user, action)
});