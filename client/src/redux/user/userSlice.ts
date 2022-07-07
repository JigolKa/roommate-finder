import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../utils/types";

export interface UserState {
 user: User | null;
}

const initialState: UserState = {
 user: null,
};

export const userSlice = createSlice({
 name: "user",
 initialState,
 reducers: {
  set: (state, action: PayloadAction<any>) => {
   state.user = action.payload;
  },
 },
});

// Action creators are generated for each case reducer function
export const { set } = userSlice.actions;

export default userSlice.reducer;
