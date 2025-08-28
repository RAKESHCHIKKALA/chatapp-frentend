import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: { showProfile: false },
  reducers: {
    toggleProfile: (state) => {
      state.showProfile = !state.showProfile;
    },
    closeProfile: (state) => {
      state.showProfile = false;
    },
  },
});

export const { toggleProfile, closeProfile } = profileSlice.actions;
export default profileSlice.reducer;
