//src/api/axios.js:
import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

export const setAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

export default instance;
