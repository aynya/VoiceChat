import axios from 'axios';


const baseUrl = 'http://localhost:3001'

export const login = async (nickname, password) => {
    try {
      const response = await axios.post(`${baseUrl}/api/login`, {
        nickname,
        password,
      });
  
      return response.data; // 返回后端响应的数据（包括 token 和用户信息）
    } catch (error) {
      console.error('登录失败:', error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || '登录失败，请检查用户名或密码！');
    }
  };

export const register = async (nickname, password, confirmPassword, avatarUrl) => {
    try {
        console.log(nickname, password, confirmPassword, avatarUrl)
      const response = await axios.post(`${baseUrl}/api/register`, {
        nickname,
        password,
        confirmPassword,
        avatarUrl,
      });
  
      return response.data; // 返回后端响应的数据
    } catch (error) {
      console.error('注册失败:', error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || '注册失败，请重试！');
    }
  };