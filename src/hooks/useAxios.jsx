import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://assignmenteleven-server-3.onrender.com/',
  
});

const useAxios = () => {
    return axiosInstance;
}

export default useAxios;

