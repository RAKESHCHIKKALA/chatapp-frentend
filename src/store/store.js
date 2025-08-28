import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; 
import profileReducer from "./profileslice";
import chatReducer from "./chatSlice";

const store = configureStore({
  reducer: {
    user: userReducer, 
    profile: profileReducer,
    chat: chatReducer,
  },
});

export default store;
