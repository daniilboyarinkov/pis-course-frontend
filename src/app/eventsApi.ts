import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IEvent} from "./types";

const TAG = 'Events';
const endpoint = '/events';

export const eventsApi = createApi({
        reducerPath: "eventsApi",
        baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3001"}),
        tagTypes: [TAG],
        endpoints: (builder) => ({
            getAll: builder.query<IEvent[], string>({
                query: () => `${endpoint}`,
                providesTags: (result) =>
                    result
                        ? [
                            ...result.map(({ event_id }) => ({ type: TAG, event_id } as const)),
                            { type: TAG, id: 'LIST' },
                        ]
                        : [{ type: TAG, id: 'LIST' }],
            }),
            get: builder.query<IEvent, string>({
                query: (id) => `${endpoint}/${id}`,
                providesTags: (result, error, id) => [{ type: TAG, id }],
            }),
            create: builder.mutation<IEvent, Partial<IEvent>>({
                query: (body) => ({
                    url: `${endpoint}`,
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result, error, { event_id }) => [{ type: TAG, event_id }],
            }),
            update: builder.mutation<IEvent, Partial<IEvent>>({
                query: (data) => {
                    const { event_id, ...body } = data;

                    return ({
                        url: `${endpoint}/${event_id}`,
                        method: 'POST',
                        body,
                    })
                },
                invalidatesTags: (result, error, { event_id }) => [{ type: TAG, event_id }],
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

export const {useCreateMutation, useDeleteMutation, useUpdateMutation, useGetAllQuery, useGetQuery} = eventsApi;

