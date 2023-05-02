import {configureStore} from '@reduxjs/toolkit';
import {booksApi} from './booksApi';
import {readersApi} from './readersApi';
import {employeesApi} from './employeesApi';
import {ordersApi} from './ordersApi';
import {eventsApi} from './eventsApi';
import {librariesApi} from './librariesApi';
import {authApi} from './auth/authApi';
import {statisticApi} from './statisticApi';
import userReducer from './auth/userSlice';

export const store = configureStore({
    reducer: {
        [booksApi.reducerPath]: booksApi.reducer,
        [readersApi.reducerPath]: readersApi.reducer,
        [employeesApi.reducerPath]: employeesApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
        [eventsApi.reducerPath]: eventsApi.reducer,
        [librariesApi.reducerPath]: librariesApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [statisticApi.reducerPath]: statisticApi.reducer,
        userState: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            [
                booksApi.middleware,
                authApi.middleware,
                statisticApi.middleware,
                readersApi.middleware,
                employeesApi.middleware,
                ordersApi.middleware,
                eventsApi.middleware,
                librariesApi.middleware,
            ]
        ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
