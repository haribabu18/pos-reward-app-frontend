import axios from "axios";

const Base_URL = "/api/auth/status";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8081', // Spring Boot backend URL
    withCredentials: true,
  });

export const LoggedinUser = async () =>{

    const res = await axiosInstance.get(Base_URL);
    return res.data.authenticated;
    
}