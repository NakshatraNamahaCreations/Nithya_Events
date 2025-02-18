import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  services: [],
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    addService: (state, action) => {
      const existingItem = state.services.find(
        (i) => i._id === action.payload._id
      );
      if (!existingItem) {
        state.services.push({
          ...action.payload,
          quantity: action.payload.quantity,
        });
      }
    },

    incrementServiceQuantity: (state, action) => {
      const item = state.services.find((i) => i._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decrementServiceQuantity: (state, action) => {
      state.services = state.services.map((item) =>
        item._id === action.payload
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );
    },

    removeService: (state, action) => {
      state.services = state.services.filter(
        (item) => item._id !== action.payload
      );
    },

    clearServices: (state) => {
      state.services = [];
    },
  },
});

export const {
  addService,
  incrementServiceQuantity,
  decrementServiceQuantity,
  removeService,
  clearServices,
} = serviceSlice.actions;
export default serviceSlice.reducer;
