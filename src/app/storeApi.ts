import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IStore} from "./types";

const endpoint = '/store';

export const storeApi = createApi({
        reducerPath: "storeApi",
        baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3001"}),
        endpoints: (builder) => ({
            getAll: builder.query<IStore[], string>({
                query: () => `${endpoint}`,
            }),
            create: builder.mutation<IStore, Partial<IStore>>({
                query: (body) => ({
                    url: `${endpoint}/create`,
                    method: 'POST',
                    body,
                }),
            }),
            update: builder.mutation<IStore, Partial<IStore>>({
                query: (data) => {
                    const { ...body } = data;

                    return ({
                        url: `${endpoint}/update`,
                        method: 'POST',
                        body,
                    })
                },
            }),
            delete: builder.mutation<{ success: boolean; data: number[] }, number>({
                query: (data) => {

                    return ({
                        url: `${endpoint}/delete`,
                        method: 'POST',
                        body: data,
                    });
                },
            }),
        }),
    }
);

export const {useCreateMutation, useDeleteMutation, useUpdateMutation, useGetAllQuery} = storeApi;

