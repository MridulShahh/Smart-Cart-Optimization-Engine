import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: "ORD-948573",
      date: new Date().toLocaleDateString(),
      status: "Processing",
      total: 45000,
      items: [
        {
          name: "Logitech MX Master 3S",
          qty: 1,
          price: 9999,
          image: "https://images.unsplash.com/photo-1527814050087-379381547961?auto=format&fit=crop&q=80&w=200",
        },
        {
          name: "Dell UltraSharp 27",
          qty: 1,
          price: 35001,
          image: "https://images.unsplash.com/photo-1527443195645-1133f7f28990?auto=format&fit=crop&q=80&w=200",
        },
      ],
    },
  ],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.items.unshift(action.payload); // Add new orders to the top
    },
    clearOrders: (state) => {
      state.items = [];
    }
  },
});

export const { addOrder, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
