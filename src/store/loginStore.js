import { create } from 'zustand';

const useLoginStore = create((set) => ({
  isLoggedIn: false, // 登录状态
  userInfo: null, // 用户信息

  // 设置登录状态
  setLoggedIn: (user) =>
    set(() => ({
      isLoggedIn: true,
      userInfo: user,
    })),

  // 清除登录状态（登出）
  clearLoginState: () =>
    set(() => ({
      isLoggedIn: false,
      userInfo: null,
    })),
}));

export default useLoginStore;