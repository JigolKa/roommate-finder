import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
 value: number;
}

const initialState: CounterState = {
 value: 0,
};

export const tabsSlice = createSlice({
 name: "tabs",
 initialState,
 reducers: {
  increment: (state) => {
   state.value += 1;
  },
  decrement: (state) => {
   state.value -= 1;
  },
  set: (state, action: PayloadAction<number>) => {
   state.value = action.payload;
  },
 },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, set } = tabsSlice.actions;

export default tabsSlice.reducer;
