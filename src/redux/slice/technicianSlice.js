import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  technicians: [],
};

const technicianSlice = createSlice({
  name: "technicians",
  initialState,
  reducers: {
    addTechnician: (state, action) => {
      const existingItem = state.technicians.find(
        (i) => i.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.technicians.push({
          ...action.payload,
          quantity: action.payload.quantity,
        });
      }
    },

    incrementTechnicianQuantity: (state, action) => {
      console.log(action.payload);
      
      const item = state.technicians.find((i) => i.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decrementTechnicianQuantity: (state, action) => {
      state.technicians = state.technicians.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );
    },

    removeTechnician: (state, action) => {
      state.technicians = state.technicians.filter(
        (item) => item.id !== action.payload
      );
    },

    clearTechnicians: (state) => {
      state.technicians = [];
    },
  },
});

export const {
  addTechnician,
  incrementTechnicianQuantity,
  decrementTechnicianQuantity,
  removeTechnician,
  clearTechnicians,
} = technicianSlice.actions;
export default technicianSlice.reducer;
