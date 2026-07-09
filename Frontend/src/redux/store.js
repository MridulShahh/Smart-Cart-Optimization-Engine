import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import settingsReducer from "./slices/settingsSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    settings: settingsReducer,
  },
});