import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  costs: [],
  loading: false,
  error: null,
};

const costsSlice = createSlice({
  name: "costs",
  initialState,
  reducers: {
    setCosts: (state, action) => {
      state.costs = action.payload;
      state.loading = false;
      state.error = null;
    },
    addCost: (state, action) => {
      state.costs.push(action.payload);
    },
    updateCost: (state, action) => {
      const index = state.costs.findIndex(
        (cost) => cost.id === action.payload.id
      );
      if (index !== -1) {
        state.costs[index] = action.payload;
      }
    },
    deleteCost: (state, action) => {
      state.costs = state.costs.filter((cost) => cost.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCosts,
  addCost,
  updateCost,
  deleteCost,
  setLoading,
  setError,
} = costsSlice.actions;
export default costsSlice.reducer;
