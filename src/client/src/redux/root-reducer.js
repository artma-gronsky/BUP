import userReducer from "./user/user.reducer";
import globalReducer from "./global/global.reducer";

export const rootReducer = ({user, global}, action) => ({
    user: userReducer(user, action),
    global: globalReducer(global, action)
});