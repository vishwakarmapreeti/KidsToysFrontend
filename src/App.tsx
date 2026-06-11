import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { selectIsAuthenticated } from "./store/slices/authSlice";
import { fetchCart, resetCart } from "./store/slices/cartSlice";
import { fetchWishlist, resetWishlist } from "./store/slices/wishlistSlice";
import AppRoutes from "./components/common/AppRoute";

function SessionDataLoader() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      return;
    }

    dispatch(resetCart());
    dispatch(resetWishlist());
  }, [dispatch, isAuthenticated]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <SessionDataLoader />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
