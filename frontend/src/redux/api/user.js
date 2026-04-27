import {apiSlice} from "./apiSlice";
import {USER_URL} from "../constants.js";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: USER_URL + '/auth',
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: USER_URL,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: USER_URL + '/logout',
                method: 'POST',
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: USER_URL + '/profile',
                method: 'PUT',
                body: data,
            }),
        }),
        GetAllUsers: builder.query({
            query: () => ({
                url: USER_URL,
                method: 'GET',
            }),
                providesTags: ['User'],
                keepUnusedDataFor: 5,
        }),
         deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/${id}`,
                method: 'DELETE',
            }),
             invalidatesTags: ['User'],
        }),
            makeAdmin: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/${id}`,
                method: 'PUT',
            }),
             invalidatesTags: ['User'],
        })



})
})

    export const {useLoginMutation, useRegisterMutation, useLogoutMutation, useProfileMutation, useGetAllUsersQuery, useDeleteUserMutation, useMakeAdminMutation} = userApiSlice;