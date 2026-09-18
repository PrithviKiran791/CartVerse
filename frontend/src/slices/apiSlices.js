import { fetchBaseQuery,createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL, PRODUCTS_URL, USERS_URL, ORDERS_URL, PAYPAL_CLIENT_ID } from "../constants";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
})

async function baseQueryWithReauth(args, api, extraOptions) {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        api.dispatch(logout());
    }

    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Product', 'User', 'Order'],
    endpoints: (builder) => ({}),
})