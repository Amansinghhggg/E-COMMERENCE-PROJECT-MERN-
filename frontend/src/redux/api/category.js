import {CATEGORY_URL} from "../constants.js";
import {apiSlice} from "./apiSlice";

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        GetAllCategories: builder.query({
            query: () => ({
                url: CATEGORY_URL,
                method: 'GET',
            }),
            providesTags: ['Category'],
            keepUnusedDataFor: 5,
        }),
        createCategory: builder.mutation({
            query: (data) => ({
                url: CATEGORY_URL,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `${CATEGORY_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({id, ...data}) => ({
                url: `${CATEGORY_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
    }),
})

export const {useGetAllCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation} = categoryApiSlice;