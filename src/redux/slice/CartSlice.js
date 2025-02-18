import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cart.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cart.push({
          ...action.payload,
          quantity: action.payload.quantity,
        });
      }
    },

    quantityIncrement: (state, action) => {
      const item = state.cart.find((item) => item._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    quantityDecrement: (state, action) => {
      state.cart = state.cart.map((item) =>
        item._id === action.payload
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
    },

    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  quantityIncrement,
  quantityDecrement,
  removeFromCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
