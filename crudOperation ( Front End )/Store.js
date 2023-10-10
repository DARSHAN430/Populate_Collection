import { configureStore } from '@reduxjs/toolkit';
import userReducer from './SlicePage';

const store = configureStore({
  reducer: {
    users : userReducer,
  },
});

export default store;
