import { configureStore } from '@reduxjs/toolkit';
import {booksApi} from './booksApi';
import {authApi} from './auth/authApi';
import userReducer from './auth/userSlice';

export const store = configureStore({
    reducer: {
        [booksApi.reducerPath]: booksApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        userState: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([booksApi.middleware, authApi.middleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
