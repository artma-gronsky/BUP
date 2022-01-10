const userState = state => state.user;

export const selectCurrentUser = state => userState(state).current;