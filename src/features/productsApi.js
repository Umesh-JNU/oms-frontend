import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  baseQuery: fetchBaseQuery({ baseUrl: "https://oms-backend.adaptable.app" }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "/api/product/all",
    }),
    getProduct: builder.query({
      query: (id) => `/api/product/${id}`,
    }),
    getAllCategories: builder.query({
      query: (location) => {
        console.log({ location });
        return `/api/category/all/?location=${location.country === 'IN' ? 'CA' : 'US'}`;
      }
    }),
    getCategory: builder.query({
      query: (id) => `/api/category/${id}`,
    }),
    getAllSubCategories: builder.query({
      query: () => "/api/subCategory/all",
    }),
    getShopDetails: builder.query({
      query: () => "/api/category/all-subCategories",
    }),
    getSubCategory: builder.query({
      query: (id) => `/api/subCategory/${id}`,
    }),
    getRecentProducts: builder.query({
      query: (id) => `/api/product/${id}/get-recent`,
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductQuery,
  useGetAllCategoriesQuery,
  useGetCategoryQuery,
  useGetAllSubCategoriesQuery,
  useGetShopDetailsQuery,
  useGetSubCategoryQuery,
  useGetRecentProductsQuery,
} = productsApi;
