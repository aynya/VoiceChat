// 模拟后端 API 地址
const BASE_URL = 'https://api.example.com'; // 替换为实际的后端地址

// 登录请求
export const login = async (username, password) => {
  try {
    // 注释：发送登录请求
    console.log('Sending login request with:', username, password);

    // 模拟返回数据
    return { token: 'mock-token', user: { username } };

    // 实际请求代码：
    // const response = await fetch(`${BASE_URL}/login`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ username, password }),
    // });
    // if (!response.ok) throw new Error('用户名或密码错误');
    // return await response.json();
  } catch (error) {
    console.error('登录失败:', error.message);
    throw error;
  }
};

// 注册请求
export const register = async (nickname, password, confirmPassword, avatar) => {
  try {
    // 注释：发送注册请求
    console.log('Sending register request with:', { nickname, password, confirmPassword, avatar });

    // 模拟返回数据
    return { success: true, message: '注册成功' };

    // 实际请求代码：
    // const formData = new FormData();
    // formData.append('nickname', nickname);
    // formData.append('password', password);
    // formData.append('confirmPassword', confirmPassword);
    // if (avatar) formData.append('avatar', avatar);

    // const response = await fetch(`${BASE_URL}/register`, {
    //   method: 'POST',
    //   body: formData,
    // });
    // if (!response.ok) throw new Error('注册失败');
    // return await response.json();
  } catch (error) {
    console.error('注册失败:', error.message);
    throw error;
  }
};