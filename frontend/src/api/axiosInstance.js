import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      try {
        const parsedToken = JSON.parse(access_token);
        config.headers.Authorization = `Bearer ${parsedToken.access}`;
        console.log('Authorization Header:', config.headers.Authorization);
      } catch (err) {
        console.error('Error parsing token in axios instance:', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;