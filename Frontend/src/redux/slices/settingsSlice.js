import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,
  language: localStorage.getItem("language") || "EN",
  currency: localStorage.getItem("currency") || "INR",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem("currency", action.payload);
    },
  },
});

export const { toggleDarkMode, setLanguage, setCurrency } = settingsSlice.actions;
export default settingsSlice.reducer;
