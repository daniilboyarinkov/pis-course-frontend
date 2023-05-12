import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider,} from "react-router-dom";
import BooksPage from './routes/BooksPage';
import App from './App';
import {Provider} from 'react-redux';
import {store} from './app/store';
import LoginPage from './routes/LoginPage';
import './index.css';
import ReadersPage from './routes/ReadersPage';
import EmployeesPage from './routes/EmployeesPage';
import LibrariesPage from './routes/LibrariesPage';
import OrdersPage from './routes/OrdersPage';
import EventsPage from './routes/EventsPage';
import StorePage from './routes/StorePage';
import IndexPage from './routes/IndexPage';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<App />}
        >
            <Route
                path="login"
                element={<LoginPage />}
            />
            <Route
                path=""
                element={<IndexPage />}
            />
            <Route
                path="books"
                element={<BooksPage />}
            />
            <Route
                path="readers"
                element={<ReadersPage />}
            />
            <Route
                path="employees"
                element={<EmployeesPage />}
            />
            <Route
                path="libraries"
                element={<LibrariesPage />}
            />OrdersPage
            <Route
                path="orders"
                element={<OrdersPage />}
            />
            <Route
                path="events"
                element={<EventsPage />}
            />
            <Route
                path="store"
                element={<StorePage />}
            />
        </Route>
    )
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </React.StrictMode>
);
