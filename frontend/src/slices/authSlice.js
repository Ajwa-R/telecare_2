// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, googleLoginApi, logoutApi } from "@/services/authService";

const initialState = {
  user: JSON.parse(localStorage.getItem("user") || "null"), // keep UX on refresh
  status: "idle",
  error: null,
};

export const login = createAsyncThunk("auth/login",
  async ({ email, password }) => await loginApi(email, password)
);

export const googleLogin = createAsyncThunk("auth/googleLogin",
  async ({ credential }) => await googleLoginApi(credential)
);

export const logout = createAsyncThunk("auth/logout", async () => await logoutApi());

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload || null;
      if (payload) localStorage.setItem("user", JSON.stringify(payload));
      else localStorage.removeItem("user");
    },
  },
  extraReducers: (b) => {
    const ok = (s, { payload }) => {
      s.user = payload;
      s.status = "succeeded";
      s.error = null;
      localStorage.setItem("user", JSON.stringify(payload)); // only user, no token
    };
    b.addCase(login.pending,   (s)=>{ s.status="loading"; s.error=null; })
     .addCase(login.fulfilled, ok)
     .addCase(login.rejected,  (s,a)=>{ s.status="failed"; s.error=a.error.message; })
     .addCase(googleLogin.fulfilled, ok)
     .addCase(logout.fulfilled, (s)=>{ s.user=null; s.status="idle"; localStorage.removeItem("user"); });
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;















// // src/slices/authSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   user: null,
//   token: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem('token');
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;
