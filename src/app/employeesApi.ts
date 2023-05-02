import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IEmployee} from "./types";

const TAG = 'Employees';
const endpoint = '/employees';

export const employeesApi = createApi({
        reducerPath: "employeeApi",
        baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3001"}),
        tagTypes: [TAG],
        endpoints: (builder) => ({
            getAll: builder.query<IEmployee[], string>({
                query: () => `${endpoint}`,
                providesTags: (result) =>
                    result
                        ? [
                            ...result.map(({ employee_id }) => ({ type: TAG, employee_id } as const)),
                            { type: TAG, id: 'LIST' },
                        ]
                        : [{ type: TAG, id: 'LIST' }],
            }),
            get: builder.query<IEmployee, string>({
                query: (id) => `${endpoint}/${id}`,
                providesTags: (result, error, id) => [{ type: TAG, id }],
            }),
            create: builder.mutation<IEmployee, Partial<IEmployee>>({
                query: (body) => ({
                    url: `${endpoint}`,
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result, error, { employee_id }) => [{ type: TAG, employee_id }],
            }),
            update: builder.mutation<IEmployee, Partial<IEmployee>>({
                query: (data) => {
                    const { employee_id, ...body } = data;

                    return ({
                        url: `${endpoint}/${employee_id}`,
                        method: 'POST',
                        body,
                    })
                },
                invalidatesTags: (result, error, { employee_id }) => [{ type: TAG, employee_id }],
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

export const {useCreateMutation, useDeleteMutation, useUpdateMutation, useGetAllQuery, useGetQuery} = employeesApi;

