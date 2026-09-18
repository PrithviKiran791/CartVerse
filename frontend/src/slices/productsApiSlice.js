import {PRODUCTS_URL} from '../constants.js'
import {apiSlice} from './apiSlice.js'

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({keyword,pageNumber}) => ({
                url: `${PRODUCTS_URL}`,
                params: {keyword,pageNumber},

            }),
            keepUnusedDataFor: 5,
            providesTags: ['Product'],
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Product'],
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: `${PRODUCTS_URL}`, 
                method: 'POST',
            }),
            invalidatesTags: ['Product'], 
        }),
        updateProduct: builder.mutation({
            query: ({productId, data}) => ({    
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,    
                method: 'DELETE',
            }),
            providesTags: ['Product'],
        }),
        createProductReview: builder.mutation({
            query: ({productId, data}) => ({
                url: `${PRODUCTS_URL}/${productId}/reviews`,   
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        updateProductStock: builder.mutation({
            query: ({productId, data}) => ({
                url: `${PRODUCTS_URL}/${productId}/stock`,  
                method: 'PUT',
                body: data,
            }), 
            invalidatesTags: ['Product'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetProductDetailsQuery,
    useCreateProductReviewMutation,
} = productsApiSlice;