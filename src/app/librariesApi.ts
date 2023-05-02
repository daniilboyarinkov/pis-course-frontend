import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ILibrary} from "./types";

const TAG = 'Libraries';
const endpoint = '/libraries';

export const librariesApi = createApi({
        reducerPath: "libraryApi",
        baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3001"}),
        tagTypes: [TAG],
        endpoints: (builder) => ({
            getAll: builder.query<ILibrary[], string>({
                query: () => `${endpoint}`,
                providesTags: (result) =>
                    result
                        ? [
                            ...result.map(({ library_id }) => ({ type: TAG, library_id } as const)),
                            { type: TAG, id: 'LIST' },
                        ]
                        : [{ type: TAG, id: 'LIST' }],
            }),
            get: builder.query<ILibrary, string>({
                query: (id) => `${endpoint}/${id}`,
                providesTags: (result, error, id) => [{ type: TAG, id }],
            }),
            create: builder.mutation<ILibrary, Partial<ILibrary>>({
                query: (body) => ({
                    url: `${endpoint}`,
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result, error, { library_id }) => [{ type: TAG, library_id }],
            }),
            update: builder.mutation<ILibrary, Partial<ILibrary>>({
                query: (data) => {
                    const { library_id, ...body } = data;

                    return ({
                        url: `${endpoint}/${library_id}`,
                        method: 'POST',
                        body,
                    })
                },
                invalidatesTags: (result, error, { library_id }) => [{ type: TAG, library_id }],
            }),
            delete: builder.mutation<{ success: boolean; id: number }, number>({
                query: (id) => ({
                    url: `${endpoint}/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: () => [{ type: TAG}],
            }),
        })
        ,
    }
);

export const {useCreateMutation, useDeleteMutation, useUpdateMutation, useGetAllQuery, useGetQuery} = librariesApi;

