import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IBookStatistic, IReaderStatistic} from "./types";

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
        }),
    }
);

export const {useGetBookStatisticQuery, useGetReaderStatisticQuery} = statisticApi;
