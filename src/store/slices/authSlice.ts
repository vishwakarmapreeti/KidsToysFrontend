import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import authService, { type AuthUser } from '../../services/authService';
import type { RootState } from '../index';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
}

const readStoredAuth = (): Pick<AuthState, 'user' | 'token'> => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!storedToken || !storedUser) {
    return { user: null, token: null };
  }

  try {
    return {
      token: storedToken,
      user: JSON.parse(storedUser) as AuthUser,
    };
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { user: null, token: null };
  }
};

const storedAuth = readStoredAuth();

const initialState: AuthState = {
  ...storedAuth,
  isLoading: false,
};

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await authService.logout();
  } catch {
    // Local logout should still succeed even if the API call fails.
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.user);

export default authSlice.reducer;
