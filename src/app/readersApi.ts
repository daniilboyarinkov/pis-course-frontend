import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IReader} from "./types";

const TAG = 'Readers';
const endpoint = '/readers';

export const readersApi = createApi({
        reducerPath: "readersApi",
        baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3001"}),
        tagTypes: [TAG],
        endpoints: (builder) => ({
            getAll: builder.query<IReader[], string>({
                query: () => `${endpoint}`,
                providesTags: (result) =>
                    result
                        ? [
                            ...result.map(({ reader_id }) => ({ type: TAG, reader_id } as const)),
                            { type: TAG, id: 'LIST' },
                        ]
                        : [{ type: TAG, id: 'LIST' }],
            }),
            get: builder.query<IReader, string>({
                query: (id) => `${endpoint}/${id}`,
                providesTags: (result, error, id) => [{ type: TAG, id }],
            }),
            create: builder.mutation<IReader, Partial<IReader>>({
                query: (body) => ({
                    url: `${endpoint}`,
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result, error, { reader_id }) => [{ type: TAG, reader_id }],
            }),
            update: builder.mutation<IReader, Partial<IReader>>({
                query: (data) => {
                    const { reader_id, ...body } = data;

                    return ({
                        url: `${endpoint}/${reader_id}`,
                        method: 'POST',
                        body,
                    })
                },
                invalidatesTags: (result, error, { reader_id }) => [{ type: TAG, reader_id }],
            }),
            delete: builder.mutation<{ success: boolean; id: number }, number>({
                query: (id) => ({
                    url: `${endpoint}/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: () => [{ type: TAG}],
            }),
        }),
    }
);

export const {useCreateMutation, useDeleteMutation, useUpdateMutation, useGetAllQuery, useGetQuery} = readersApi;

