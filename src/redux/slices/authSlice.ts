import { PayloadAction } from './../../../node_modules/@reduxjs/toolkit/src/createAction';
import { Role } from './../../enums/roles';
import { createSlice } from "@reduxjs/toolkit"

interface Payload{
        userId: string,
        role: Role
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: "",
    role: Role.CLIENT
  },
  reducers: {
     setAuth(state, action: PayloadAction<Payload>) {
        state.userId = action.payload.userId,
        state.role = action.payload.role
    }
  }
})

export const { setAuth } = authSlice.actions;

export default authSlice.reducer