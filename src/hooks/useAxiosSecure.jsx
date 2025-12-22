import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";

const instance = axios.create({
  baseURL: "https://assignmenteleven-server-3.onrender.com/",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth(); // ✅ FIX: use correct function name

  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(
      async (config) => {
        if (user) {
          const token = await user.getIdToken();
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    const responseInterceptor = instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          console.log("log out the user for bad request");
          await logoutUser(); // ✅ FIX
          navigate("/register");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logoutUser, navigate]); // ✅ FIX deps

  return instance;
};

export default useAxiosSecure;
