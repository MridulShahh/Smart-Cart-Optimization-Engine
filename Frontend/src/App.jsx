import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { loadLocalCart, fetchCart } from "./redux/slices/cartSlice";
import { fetchProducts } from "./redux/slices/productSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Pre-fetch products on app load so they're available everywhere
    dispatch(fetchProducts());

    // Initialize cart
    if (user?.id) {
      dispatch(fetchCart(user.id));
    } else {
      dispatch(loadLocalCart());
    }
  }, [dispatch, user?.id]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </>
  );
}

export default App;