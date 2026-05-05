import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "user",
  initialState: {
    userLogin: null,
    usertoken: null,
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
      localStorage.setItem("users", JSON.stringify(state.users));
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
      console.log(state.users);
    },
    removeUser: (state, action) => {
      const userId = action.payload.id;
      state.users = state.users.filter((user) => user.id !== userId);
      localStorage.setItem("users", JSON.stringify(state.users));
    },
    getUsers: (state) => {
      const users = state.users;
      localStorage.setItem("users", JSON.stringify(state.users));
      return users;
    },
    loginSlice: (state, action) => {
      console.log("action.payload:", action.payload);
      // Almacena la información del usuario y el token en el estado
      state.userLogin = action.payload.userLogin;
      state.usertoken = action.payload.accessToken;
      // Almacena también en el localStorage
      localStorage.setItem(
        "userLogin",
        JSON.stringify(action.payload.userLogin),
      );
      localStorage.setItem("usertoken", action.payload.accessToken);
    },
    logoutUser: (state) => {
      state.userLogin = null;
      state.usertoken = null;
      localStorage.removeItem("userLogin");
      localStorage.removeItem("usertoken");
    },
    setUserLogin: (state, action) => {
      state.userLogin = action.payload;
      // También actualizamos el localStorage para mantener la consistencia
      if (typeof window !== "undefined") {
        localStorage.setItem("userLogin", JSON.stringify(action.payload));
      }
    },
    setUserToken: (state, action) => {
      state.usertoken = action.payload;
      localStorage.setItem("usertoken", action.payload);
    },
  },
});

export const {
  setUsers,
  addUser,
  removeUser,
  getUsers,
  loginSlice,
  logoutUser,
  setUserLogin,
  setUserToken,
} = userSlice.actions;

export default userSlice.reducer;

// Selector para obtener el usuario logueado
export const selectUserLogin = (state) => state.user.userLogin;
export const selectUserToken = (state) => state.user.usertoken;
