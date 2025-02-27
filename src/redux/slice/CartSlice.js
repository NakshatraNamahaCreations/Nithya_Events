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
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        console.log("The exisiting",action.payload._id);
        
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cart.push({
          ...action.payload,
          quantity: action.payload.quantity,
        });
      }
    },

    quantityIncrement: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    quantityDecrement: (state, action) => {
      state.cart = state.cart.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );
    },

    removeFromCart: (state, action) => {
      console.log(action.payload.id);
      
      state.cart = state.cart.filter((item) => item.id !== action.payload);
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
