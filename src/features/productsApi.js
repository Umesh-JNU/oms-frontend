import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://api.bostongexotics.com" }),
  baseQuery: fetchBaseQuery({ baseUrl: "https://boston-api.adaptable.app" }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "/api/product/all",
    }),
    getAllCategories: builder.query({
      query: () => "/api/category/all",
    }),
    getAllSubCategories: builder.query({
      query: () => "/api/subCategory/all",
    }),
    getShopDetails: builder.query({
      query: () => "/api/category/all-subCategories",
    }),
    getProduct: builder.query({
      query: (id) => `/api/product/${id}`,
    }),
    getCategory: builder.query({
      query: (id) => `/api/category/${id}`,
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
  useGetAllCategoriesQuery,
  useGetAllSubCategoriesQuery,
  useGetProductQuery,
  useGetCategoryQuery,
  useGetSubCategoryQuery,
  useGetRecentProductsQuery,
  useGetShopDetailsQuery,
} = productsApi;
