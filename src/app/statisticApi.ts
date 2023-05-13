import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IBookStatistic, IReaderStatistic, ITakenBooksStatistic, IUserBooksStatistic} from "./types";

export const statisticApi = createApi({
        reducerPath: "statisticApi",
        baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3001/statistic"}),
        endpoints: (builder) => ({
            getBookStatistic: builder.query<IBookStatistic, string>({
                query: (id) => `/book/${id}`,
            }),
            getReaderStatistic: builder.query<IReaderStatistic, string>({
                query: (id) => `/reader/${id}`,
            }),
            getLibraryStatistic: builder.query<IReaderStatistic, string>({
                query: (id) => `/library/${id}`,
            }),
            getTakenStatistic: builder.query<ITakenBooksStatistic[], string>({
                query: () => `/taken-books`,
            }),
            getUserBooksStatistic: builder.query<IUserBooksStatistic[], string>({
                query: (id) => `/user-books/${id}`,
            }),
        }),
    }
);

export const {useGetBookStatisticQuery, useGetReaderStatisticQuery, useGetLibraryStatisticQuery, useGetTakenStatisticQuery, useGetUserBooksStatisticQuery} = statisticApi;
