import axios from 'axios';
import { message } from 'antd';

const baseUrl = 'http://43.139.233.108:3001/api'

const apiClient = axios.create({
    baseURL: 'http://43.139.233.108:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
apiClient.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // 如果错误状态码是 401 并且不是刷新令牌请求，则尝试刷新令牌
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log('刷新令牌请求');
                // const refreshToken = localStorage.getItem('refreshToken');
                // if (!refreshToken) {
                //     throw new Error('No refresh token found');
                // }

                const refreshResponse = await axios.post(`${baseUrl}/refresh`, {}, {
                    withCredentials: true, // 确保发送 Cookie
                });

                const { accessToken } = refreshResponse.data;

                // 更新本地存储中的访问令牌
                localStorage.setItem('accessToken', accessToken);

                // 将新的访问令牌添加到原始请求头中
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // 重新发送原始请求
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('刷新令牌失败:', refreshError.response?.data?.error || refreshError.message);
                message.error('登录已过期，请重新登录');
                // 清除所有令牌并重定向到登录页面
                localStorage.removeItem('accessToken');
                // localStorage.removeItem('refreshToken');
                localStorage.removeItem('loggedInUser');
                window.location.href = '/'; // 根据实际情况调整重定向路径
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;