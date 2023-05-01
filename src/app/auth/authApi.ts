import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {LoginInput} from '../../routes/LoginPage';
import {setUser} from './userSlice';
import {IEmployee, IUser, Position} from '../types';
import {toast} from 'react-toastify';
import {isUserEmployee} from '../../utils/utils';

export const authApi = createApi({
        reducerPath: "authApi",
        baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3001"}),
        endpoints: (builder) => ({
            login: builder.mutation<
                IUser,
                LoginInput
            >({
                query(data) {
                    return {
                        url: 'login',
                        method: 'POST',
                        body: data,
                    };
                },
                async onQueryStarted(args, { dispatch, queryFulfilled }) {
                    try {
                        const { data } = await queryFulfilled;
                        if (data) {
                            const user: IUser = {...data, role: isUserEmployee(data) ? (data as IEmployee).pos : Position.READER};

                            toast.success(`Добро пожаловать, ${user.first_name} ${user.last_name}!`);
                            dispatch(setUser(user));
                            window.localStorage.setItem('user', JSON.stringify(user));
                        } else {
                            throw new Error('Неверный логин или пароль!');
                        }
                    } catch (error: any) {
                        toast.error(error?.message);
                    }
                },
            }),
            update: builder.query<any, string>({
                query: () => `/update`,
            }),
        }),
    });

export const {useLoginMutation, useUpdateQuery} = authApi;
