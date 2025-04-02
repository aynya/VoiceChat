import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/login/loginPage';
import ChannelsPanel from './components/channels/ChannelsPanel';
import { Layout } from 'antd';
import './CSS/main.css';
import useLoginStore from './store/loginStore';

const App = () => {
  const { isLoggedIn, setLoggedIn } = useLoginStore();


  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser');
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      setLoggedIn(user);
    }
  }, [setLoggedIn])


  return (
    <Router>
      <Routes>
        {/* 如果用户已登录，重定向到主页面 */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/main" /> : <LoginPage />}
        />

        {/* 主页面 */}
        <Route
          path="/main"
          element={
            isLoggedIn ? (
              <Layout hasSider style={{ height: '100vh' }}>
                <ChannelsPanel />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* 其他路径重定向到登录页 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;