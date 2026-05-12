import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  userLogin: { email: string; role: string } | null;
  usertoken: string | null;
}

const initialState: UserState = {
  userLogin: null,
  usertoken: null,
};


interface RootState {
  user: UserState;
}


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSlice: (state, action) => {
      state.userLogin = action.payload.userLogin;
      state.usertoken = action.payload.accessToken;
    },
    logoutUser: (state) => {
      state.userLogin = null;
      state.usertoken = null;
    },
    setUserToken: (state, action) => {
      state.usertoken = action.payload;
    },
  },
});

export const { loginSlice, logoutUser, setUserToken } = userSlice.actions;

export default userSlice.reducer;

export const selectUserLogin = (state: RootState) => state.user.userLogin;
export const selectUserToken = (state: RootState) => state.user.usertoken;