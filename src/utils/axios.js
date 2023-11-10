import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000"
  // baseURL: "https://boston-api.adaptable.app"
});


export default instance;


// PL<okm_)(-09