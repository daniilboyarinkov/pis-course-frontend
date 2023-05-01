import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IBook} from "./types";

export const booksApi = createApi({
        reducerPath: "booksApi",
        baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3001"}),
        tagTypes: ['Books'],
        endpoints: (builder) => ({
            getAllBooks: builder.query<IBook[], string>({
                query: () => `/books`,
                providesTags: (result) =>
                    result
                        ? [
                            ...result.map(({ book_id }) => ({ type: 'Books', book_id } as const)),
                            { type: 'Books', id: 'LIST' },
                        ]
                        : [{ type: 'Books', id: 'LIST' }],
            }),
            getBook: builder.query<IBook[], string>({
                query: (id) => `/books/${id}`,
                providesTags: (result, error, id) => [{ type: 'Books', id }],
            }),
            createBook: builder.mutation<IBook, Partial<IBook>>({
                query: (body) => ({
                    url: `/books/create`,
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result, error, { book_id }) => [{ type: 'Books', book_id }],
            }),
            updateBook: builder.mutation<IBook, Partial<IBook>>({
                query: (data) => {
                    const { book_id, ...body } = data;

                    return ({
                        url: `/books/${book_id}`,
                            method: 'POST',
                            body,
                    })
                },
                invalidatesTags: (result, error, { book_id }) => [{ type: 'Books', book_id }],
            }),
            deleteBook: builder.mutation<{ success: boolean; id: number }, number>({
                query: (id) => ({
                    url: `/books/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: (result, error, id) => [{ type: 'Books', id }],
            }),
        }),
    }
);

export const {useCreateBookMutation, useDeleteBookMutation, useUpdateBookMutation, useGetAllBooksQuery, useGetBookQuery} = booksApi;
