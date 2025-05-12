import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice'; // Import the todos slice

const store = configureStore({
  reducer: {
    todos: todosReducer, // Add the todos reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;