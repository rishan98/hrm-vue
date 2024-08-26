import axios from 'axios';
import store from '@/store';
const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api'
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        const tokenExpiry = localStorage.getItem('tokenExpire');

        if (tokenExpiry && new Date().getTime() > tokenExpiry) {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpire');

            router.push('/auth/login');

            return Promise.reject('Token expired');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;
