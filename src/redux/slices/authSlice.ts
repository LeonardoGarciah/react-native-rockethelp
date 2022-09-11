import { PayloadAction } from "./../../../node_modules/@reduxjs/toolkit/src/createAction";
import { Role } from "./../../enums/roles";
import { createSlice } from "@reduxjs/toolkit";

interface Payload {
  userId: string;
  role: Role;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: "",
    role: Role.CLIENT,
    deviceToken: "",
  },
  reducers: {
    setAuth(state, action: PayloadAction<Payload>) {
      (state.userId = action.payload.userId),
        (state.role = action.payload.role)
    },
    setDeviceToken(state, action){
      (state.deviceToken = action.payload)
    }
  },
});

export const { setAuth, setDeviceToken } = authSlice.actions;

export default authSlice.reducer;
