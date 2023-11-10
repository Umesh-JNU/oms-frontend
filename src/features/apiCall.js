import axios from "../utils/axios";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  registerFailure,
  registerStart,
  registerSuccess,
} from "./authSlice";
import { buyAgainFailure, buyAgainStart, buyAgainSuccess } from "./buyAgain";
import {
  addTooCartFailure,
  addTooCartStart,
  addTooCartSuccess,
  deleteFromCartFailure,
  deleteFromCartStart,
  deleteFromCartSuccess,
  getCartFailure,
  getCartStart,
  getCartSuccess,
  updateCartFailure,
  updateCartStart,
  updateCartSuccess,
} from "./cartSlice";

export const login = async (dispatch, user) => {
  dispatch(loginStart());

  const { email, password } = user;

  try {
    const { data } = await axios.post("/api/user/login", { email, password });

    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFailure(error?.response?.data?.error));
  }
};

export const register = async (dispatch, user) => {
  dispatch(registerStart());

  const {
    firstname,
    lastname,
    address,
    telephone,
    fax,
    email,
    password,
    mobile_no,
    refer_code,
  } = user;

  try {
    const { data } = await axios.post("/api/user/register", {
      firstname,
      lastname,
      address,
      telephone,
      fax,
      email,
      password,
      mobile_no,
      refer_code,
    });

    dispatch(registerSuccess(data));
  } catch (error) {
    dispatch(registerFailure(error?.response?.data?.error));
  }
};

export const addCart = async (dispatch, data) => {
  const { prodId: product, count: quantity } = data;
  const token = localStorage.getItem("userToken");
  dispatch(addTooCartStart());

  try {
    const { data } = await axios.post(
      "/api/cart/add",
      { product, quantity },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (data) {
      dispatch(addTooCartSuccess({ data, product }));
    }
  } catch (error) {
    dispatch(addTooCartFailure(error?.response?.data?.error?.message));
  }
};

export const updateCart = async (dispatch, data) => {
  const { prodId, count: quantity } = data;
  const token = localStorage.getItem("userToken");
  dispatch(updateCartStart());

  try {
    const { data } = await axios.put(
      `/api/cart/item/${prodId}`,
      { quantity },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (data) {
      dispatch(updateCartSuccess({ data, prodId }));
    }
  } catch (error) {
    dispatch(updateCartFailure(error?.response?.data?.error?.message));
  }
};

export const deleteCart = async (dispatch, data) => {
  const { prodId } = data;
  const token = localStorage.getItem("userToken");
  dispatch(deleteFromCartStart());

  try {
    const { data } = await axios.delete(`/api/cart/item/${prodId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    if (data) {
      dispatch(deleteFromCartSuccess(data));
    }
  } catch (error) {
    dispatch(deleteFromCartFailure(error?.response?.data?.error?.message));
  }
};

export const getCart = async (dispatch) => {
  const token = localStorage.getItem("userToken");
  dispatch(getCartStart());

  try {
    const { data } = await axios.get(
      "/api/cart/all",

      {
        headers: {
          Authorization: token,
        },
      }
    );

    const { cartItems, total, inSalePrice } = data;
    dispatch(getCartSuccess({ cartItems, total, inSalePrice }));
  } catch (error) {
    dispatch(getCartFailure(error?.response?.data?.error?.message));
  }
};

export const buyAgain = async (dispatch, data) => {
  const token = localStorage.getItem("userToken");
  const { orderId } = data;

  dispatch(buyAgainStart());

  try {
    const { data } = await axios.post(
      "/api/cart/recent-cart",
      {
        orderId,
      },
      {
        headers: { Authorization: `${token}` },
      }
    );

    dispatch(buyAgainSuccess(data));
  } catch (error) {
    console.log(error);
    dispatch(buyAgainFailure(error?.response?.data?.error?.message));
  }
};
