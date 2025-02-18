import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  startDate: null,
  endDate: null,
  numberOfDays: 0,
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setDates: (state, action) => {
      const { startDate, endDate } = action.payload;
      state.startDate = startDate;
      state.endDate = endDate;

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        state.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days
      } else {
        state.numberOfDays = 0;
      }
    },
  },
});

export const { setDates } = dateSlice.actions;
export default dateSlice.reducer;
