import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getUserProfile } from "../../user/services/profileServices";
import { fetchProfile } from "../../instructor/services/instructorServices";



export interface IBaseProfile {
  id?: string;
  name: string;
  email: string;
  bio?: string;
  profileImage?: string;
  blocked?: boolean;
}


export interface User extends IBaseProfile {
  phone?: string;
  gender?: string;
  dob?: string;
  location?: string;
  googleId?: string;
  provider: "google" | "local";
}

export interface IInstructor extends IBaseProfile {
  password: string;
  expertise?: string;
  KYCApproved: boolean;
  joinedAt: Date;
  KYCstatus: "pending" | "verified" | "rejected" | "notApplied";
  work?: string;
  education?: string;
}




interface IAuthState {
    user: User | IInstructor | null;
    role : "user" | "instructor" | null,
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}


const initialState: IAuthState = {
    user: null,
    role : null,
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


export const fetchInstructorProfile = createAsyncThunk<IInstructor,void,
  { rejectValue: string }
>("auth/fetchInstructorProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await fetchProfile();
    if (!res) throw new Error("No response");
    return res.data.data;
  } catch {
    return rejectWithValue("Failed to fetch instructor");
  }
});




const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        
        logoutSuccess(state) {
            localStorage.removeItem('token')
            state.user = null
            state.role = null
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
        state.role = 'user'
        state.isAuthenticated = true;
      })

      .addCase(fetchInstructorProfile.pending,(state)=>{
        state.loading = true;
        state.error = null
      })
      .addCase(fetchInstructorProfile.fulfilled,(state , action)=>{
        state.loading = false;
        state.user = action.payload;
        state.role = 'instructor';
        state.isAuthenticated = true
      })

      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unauthorized";
      })

      .addCase(fetchInstructorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unauthorized";
      });
  },
})


export const {  logoutSuccess } = authSlice.actions
export default authSlice.reducer