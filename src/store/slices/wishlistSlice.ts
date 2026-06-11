import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import wishlistService, { type WishlistProduct } from '../../services/wishlistService';
import { logoutUser } from './authSlice';
import type { RootState } from '../index';

interface WishlistState {
  wishlist: WishlistProduct[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: [],
  isLoading: false,
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response?.data?.message === 'string'
  ) {
    return (error as any).response.data.message;
  }

  return fallback;
};

export const fetchWishlist = createAsyncThunk<
  WishlistProduct[],
  void,
  { state: RootState; rejectValue: string }
>('wishlist/fetchWishlist', async (_, { getState, rejectWithValue }) => {
  if (!getState().auth.user) return [];

  try {
    const res = await wishlistService.getWishlist();
    return res.data.wishlist.products;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Could not load wishlist.'));
  }
});

export const toggleWishlist = createAsyncThunk<
  { added: boolean; products: WishlistProduct[] },
  string,
  { rejectValue: string }
>('wishlist/toggleWishlist', async (productId, { rejectWithValue }) => {
  try {
    const toggleRes = await wishlistService.toggle(productId);
    const wishlistRes = await wishlistService.getWishlist();
    return {
      added: toggleRes.data.added,
      products: wishlistRes.data.wishlist.products,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Could not update wishlist.'));
  }
});

export const clearWishlist = createAsyncThunk<void, void, { rejectValue: string }>(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      await wishlistService.clear();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Could not clear wishlist.'));
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    resetWishlist: (state) => {
      state.wishlist = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.wishlist = [];
        state.isLoading = false;
        state.error = action.payload ?? 'Could not load wishlist.';
      })
      .addCase(toggleWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload.products;
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.error = action.payload ?? 'Could not update wishlist.';
      })
      .addCase(clearWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.wishlist = [];
        state.isLoading = false;
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Could not clear wishlist.';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.wishlist = [];
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;

export const selectWishlistCount = (state: RootState) => state.wishlist.wishlist.length;
export const selectIsInWishlist = (state: RootState, productId: string | null) =>
  productId && state.wishlist.wishlist.some((product) => product._id === productId);

export default wishlistSlice.reducer;
