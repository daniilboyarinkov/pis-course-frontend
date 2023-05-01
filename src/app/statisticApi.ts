import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IBookStatistic} from "./types";

export const statisticApi = createApi({
        reducerPath: "statisticApi",
        baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3001/statistic"}),
        endpoints: (builder) => ({
            getBookStatistic: builder.query<IBookStatistic, string>({
                query: (id) => `/book/${id}`,
            }),
        }),
    }
);

export const {useGetBookStatisticQuery} = statisticApi;
