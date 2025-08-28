import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // will store {name, email, token...}
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("Redux login action called with payload:", action.payload);
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      console.log("User state updated in Redux:", state.user);
    },
    logout: (state) => {
      console.log("Redux logout action called");
      state.user = null;
      localStorage.removeItem("user");
    },
    loadUser: (state) => {
      console.log("Redux loadUser action called");
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          console.log("Loading user from localStorage:", userData);
          state.user = userData;
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("user");
        }
      } else {
        console.log("No saved user found in localStorage");
      }
    },
  },
});

export const { login, logout, loadUser } = userSlice.actions;
export default userSlice.reducer;
