import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import cartService, { type Cart } from '../../services/cartService';
import { logoutUser } from './authSlice';
import type { RootState } from '../index';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isCartOpen: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  isCartOpen: false,
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

export const fetchCart = createAsyncThunk<
  Cart | null,
  void,
  { state: RootState; rejectValue: string }
>('cart/fetchCart', async (_, { getState, rejectWithValue }) => {
  if (!getState().auth.user) return null;

  try {
    const res = await cartService.getCart();
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Could not load cart.'));
  }
});

export const addCartItem = createAsyncThunk<
  Cart,
  { productId: string; quantity?: number },
  { rejectValue: string }
>('cart/addCartItem', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const res = await cartService.addToCart(productId, quantity);
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to add item to cart.'));
  }
});

export const updateCartItem = createAsyncThunk<
  Cart,
  { itemId: string; quantity: number },
  { rejectValue: string }
>('cart/updateCartItem', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const res = await cartService.updateItem(itemId, quantity);
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Could not update cart item.'));
  }
});

export const removeCartItem = createAsyncThunk<
  Cart,
  string,
  { rejectValue: string }
>('cart/removeCartItem', async (itemId, { rejectWithValue }) => {
  try {
    const res = await cartService.removeItem(itemId);
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Could not remove cart item.'));
  }
});

export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Could not clear cart.'));
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    resetCart: (state) => {
      state.cart = null;
      state.isLoading = false;
      state.isCartOpen = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.cart = null;
        state.isLoading = false;
        state.error = action.payload ?? 'Could not load cart.';
      })
      .addCase(addCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.isLoading = false;
        state.isCartOpen = true;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to add item to cart.';
      })
      .addCase(updateCartItem.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload ?? 'Could not update cart item.';
      })
      .addCase(removeCartItem.pending, (state) => {
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload ?? 'Could not remove cart item.';
      })
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
        state.isLoading = false;
        state.isCartOpen = false;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Could not clear cart.';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.cart = null;
        state.isLoading = false;
        state.isCartOpen = false;
        state.error = null;
      });
  },
});

export const { openCart, closeCart, resetCart } = cartSlice.actions;

export const selectCartCount = (state: RootState) =>
  state.cart.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

export default cartSlice.reducer;
