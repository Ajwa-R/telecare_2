// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  googleLoginApi,
  logoutApi,
  fetchMeApi,
} from "@/services/authService";

const initialState = {
  user: JSON.parse(localStorage.getItem("user") || "null"), // keep UX on refresh
  status: "idle",
  error: null,
};

// /auth/me thunk (cookie se user)
export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  const user = await fetchMeApi();
  return user;
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => await loginApi(email, password)
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ credential }) => await googleLoginApi(credential)
);

export const logout = createAsyncThunk(
  "auth/logout",
  async () => await logoutApi()
);

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

    //  /me lifecycle
    b.addCase(fetchMe.pending,   (s)=>{ s.status="loading"; s.error=null; })
      .addCase(fetchMe.fulfilled, ok)
      .addCase(fetchMe.rejected,  (s,a)=>{ s.status="failed"; s.user=null; s.error=a.error.message; })
      
    b.addCase(login.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(login.fulfilled, ok)
      .addCase(login.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message;
      })
      .addCase(googleLogin.fulfilled, ok)
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.status = "idle";
        localStorage.removeItem("user");
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
