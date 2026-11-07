import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';
import { borrowLimitMiddleware } from './middleware/borrowLimitMiddleware';

export const createAppStore = () =>
  configureStore({
    reducer: { books: booksReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(borrowLimitMiddleware),
  });

export const store = createAppStore();
export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
