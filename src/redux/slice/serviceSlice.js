import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  services: [],
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
   addService: (state, action) => {
  const existingItemIndex = state.services.findIndex(
    (item) => item.id === action.payload.id
  );

  if (existingItemIndex !== -1) {
    // Update the existing service (overwrite with latest, including updated addons)
    state.services[existingItemIndex] = {
      ...state.services[existingItemIndex],
      ...action.payload,
    };
  } else {
    state.services.push({
      ...action.payload,
      quantity: action.payload.quantity || 1,
    });
  }
},


    incrementServiceQuantity: (state, action) => {
      const item = state.services.find((i) => i.id === action.payload);
      
      if (item) {
        item.quantity += 1;
      }
    },

    decrementServiceQuantity: (state, action) => {
      state.services = state.services.map((item) =>
        item.id === action.payload  
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );
    },

    removeService: (state, action) => {
      state.services = state.services.filter((item) => item.id !== action.payload);

    },

    updateServiceAddons: (state, action) => {
  const { id, addons } = action.payload;
  const item = state.services.find(service => service.id === id);
  if (item) {
    item.addOns = addons;
    item.totalPrice =
      (item.productPrice || 0) +
      addons.reduce((sum, addon) => sum + (addon.price || 0), 0);
  }
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
  updateServiceAddons,
} = serviceSlice.actions;
export default serviceSlice.reducer;
