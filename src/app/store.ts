import { configureStore } from '@reduxjs/toolkit';
import {booksApi} from './booksApi';
import {authApi} from './auth/authApi';
import {statisticApi} from './statisticApi';
import userReducer from './auth/userSlice';

export const store = configureStore({
    reducer: {
        [booksApi.reducerPath]: booksApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [statisticApi.reducerPath]: statisticApi.reducer,
        userState: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([booksApi.middleware, authApi.middleware, statisticApi.middleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
