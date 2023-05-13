import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IOrder} from "./types";

const TAG = 'Orders';
const endpoint = '/orders';

export const ordersApi = createApi({
        reducerPath: "ordersApi",
        baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3001"}),
        tagTypes: [TAG],
        endpoints: (builder) => ({
            getAll: builder.query<IOrder[], string>({
                query: () => `${endpoint}`,
                providesTags: (result) =>
                    result
                        ? [
                            ...result.map(({ order_id }) => ({ type: TAG, order_id } as const)),
                            { type: TAG, id: 'LIST' },
                        ]
                        : [{ type: TAG, id: 'LIST' }],
            }),
            get: builder.query<IOrder, string>({
                query: (id) => `${endpoint}/${id}`,
                providesTags: (result, error, id) => [{ type: TAG, id }],
            }),
            create: builder.mutation<IOrder, Partial<IOrder>>({
                query: (body) => ({
                    url: `${endpoint}`,
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result, error, { order_id }) => [{ type: TAG, order_id }],
            }),
            update: builder.mutation<IOrder, Partial<IOrder>>({
                query: (data) => {
                    const { order_id, ...body } = data;

                    return ({
                        url: `${endpoint}/${order_id}`,
                        method: 'POST',
                        body,
                    })
                },
                invalidatesTags: (result, error, { order_id }) => [{ type: TAG, order_id }],
            }),
            delete: builder.mutation<{ success: boolean; id: number }, number>({
                query: (id) => ({
                    url: `${endpoint}/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: () => [{ type: TAG}],
            }),
            close: builder.mutation<{ success: boolean; id: number }, number>({
                query: (id) => ({
                    url: `${endpoint}/${id}/close`,
                    method: 'POST',
                }),
                invalidatesTags: () => [{ type: TAG}],
            }),
        })
        ,
    }
);

export const {useCreateMutation, useDeleteMutation, useUpdateMutation, useGetAllQuery, useCloseMutation} = ordersApi;

