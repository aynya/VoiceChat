import axios from 'axios';


const baseUrl = 'http://43.139.233.108:3001'

export const login = async (nickname, password) => {
  try {
    const response = await axios.post(`${baseUrl}/api/login`, {
      nickname,
      password,
    }, {
      withCredentials: true, // 确保接收并存储 Cookie
  });

    const { accessToken, user } = response.data;

    // 存储令牌到本地存储
    localStorage.setItem('accessToken', accessToken);
    // localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    return response.data; // 返回后端响应的数据（包括 token 和用户信息）
  } catch (error) {
    console.error('登录失败:', error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '登录失败，请检查用户名或密码！');
  }
};

export const register = async (nickname, password, confirmPassword, avatarUrl) => {
  try {
    const response = await axios.post(`${baseUrl}/api/register`, {
      nickname,
      password,
      confirmPassword,
      avatarUrl,
    });

    // const { accessToken, refreshToken } = response.data;

    // // 存储令牌到本地存储
    // localStorage.setItem('accessToken', accessToken);
    // localStorage.setItem('refreshToken', refreshToken);

    return response.data; // 返回后端响应的数据
  } catch (error) {
    console.error('注册失败:', error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '注册失败，请重试！');
  }
};