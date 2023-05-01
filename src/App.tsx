import React from "react"

import { Outlet } from "react-router-dom"

import { Header } from "./components/Header"
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useAppSelector} from './app/hooks';
import LoginPage from './routes/LoginPage';

function App(): JSX.Element {
    const {isLoggedIn} = useAppSelector(state => state.userState);

    return (
        <div
            className="grid min-h-screen"
            style={{
                gridTemplateRows: "auto 1fr auto",
            }}
        >
            <Header />
            {
                isLoggedIn
                    ? <Outlet />
                    : <LoginPage />
            }
            <ToastContainer position='bottom-right' />
        </div>
    )
}

export default App
