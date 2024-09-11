import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userLogout } from "../(services)/api/api";

// Function to load user from AsyncStorage
const loadUserFromStorage = async () => {
  try {
    const userInfo = await AsyncStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Failed to load user info", error);
    return null;
  }
};

const initialState = {
  user: null,
  token: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.loading = false;
      AsyncStorage.setItem("userInfo", JSON.stringify(action.payload));
      AsyncStorage.setItem("setToken", JSON.stringify(action.payload.token));
    },
    logoutAction: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      AsyncStorage.removeItem("userInfo");
      AsyncStorage.removeItem("setToken");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.loading = false;
      AsyncStorage.setItem("userInfo", JSON.stringify(action.payload));
      AsyncStorage.setItem("setToken", JSON.stringify(action.payload.token));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateUser: (state, action) => {
      if (state.user) {
        // Update the user state with the provided payload
        state.user = { ...state.user, ...action.payload };
        AsyncStorage.setItem("userInfo", JSON.stringify(state.user));
      }
    },
  },
});

export const {
  loginAction,
  logoutAction,
  setUser,
  setLoading,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;

// Thunk to load user from AsyncStorage when the app starts
export const loadUser = () => async (dispatch) => {
  const user = await loadUserFromStorage();
  if (user) {
    dispatch(setUser(user));
  } else {
    dispatch(setLoading(false));
  }
};

