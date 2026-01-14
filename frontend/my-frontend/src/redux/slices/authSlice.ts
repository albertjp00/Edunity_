import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getUserProfile } from "../../user/services/profileServices";
import type { User } from "../../user/interfaces";






interface IAuthState {
    user: User | null,
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}


const initialState: IAuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
}


export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await getUserProfile();
    
    if(!res) return 
    return res.data.data;
  } catch (err: unknown) {
    console.log(err);
    return rejectWithValue(
    "Failed to fetch user"
    );
  }
});



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        
        logoutSuccess(state) {
            localStorage.removeItem('token')
            state.user = null
            state.isAuthenticated = false;
        },

    },
    extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unauthorized";
      });
  },
})


export const {  logoutSuccess } = authSlice.actions
export default authSlice.reducer