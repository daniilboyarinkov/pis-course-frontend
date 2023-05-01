import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../types';

const initUser: IUser =
    window.localStorage.getItem('user')
    ? JSON.parse(window.localStorage.getItem('user')!)
    : null;

interface IUserState {
    user: IUser | null,
    isLoggedIn: boolean,
}

const initialState: IUserState = {
    user: initUser ?? null,
    isLoggedIn: !!initUser,
};

export const userSlice = createSlice({
    initialState,
    name: 'userSlice',
    reducers: {
        logout: (state) => {
            window.localStorage.setItem('user', '');
            state.user = initialState.user;
            state.isLoggedIn = initialState.isLoggedIn;
        },
        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
            if (action.payload) {
                state.isLoggedIn = true;
            }
        },
    },
});

export default userSlice.reducer;

export const { logout, setUser } = userSlice.actions;
