import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  savedLocation: [],
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    addLocation: (state, action) => {
      state.savedLocation.push(action.payload);
    },
    toggleLocationCheck: (state, action) => {
      const location = state.savedLocation.find(
        (item) => item.id === action.payload
      );
      if (location) {
        location.checked = !location.checked;
      }
    },
  },
});

export const { addLocation, toggleLocationCheck } = locationSlice.actions;
export default locationSlice.reducer;
