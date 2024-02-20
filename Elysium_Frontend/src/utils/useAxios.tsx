import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigation, Route } from '../types';
const baseURL = "http://127.0.0.1:8000/user";

const useAxios = (navigation: Navigation) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAxios must be used within an AuthProvider");
  }

  const { authTokens, setUser, setAuthTokens, logoutUser } = authContext;
  //console.log(authTokens)
  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwtDecode(authTokens.access);

    const isExpired = user.exp !== undefined && dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    console.log("token expired")
    
    try {
      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens.refresh,
      });

      localStorage.setItem("authTokens", JSON.stringify(response.data));
      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));

      req.headers.Authorization = `Bearer ${response.data.access}`;
      return req;

    } catch (error) {
      // Handle the error, e.g., by logging out the user and redirecting to the login screen
      console.error("Error refreshing token:", error);
      logoutUser();
      navigation.navigate('LoginScreen');
      throw error; // Rethrow the error to propagate it to the caller
    }
  });

  return axiosInstance;
};

export default useAxios;
