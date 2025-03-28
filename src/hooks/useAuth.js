import {useState} from 'react';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true); // 暂时默认为已登录
    const [user, setUser] = useState({
        id: "10",
        username: "ay",
        avatar: "https://avatars.githubusercontent.com/u/1014730?v=4",
    });

    // const login = (userData) => {
    //     setIsAuthenticated(true);
    //     setUser(userData);
    // };

    // const logout = () => {
    //     setIsAuthenticated(false);
    //     setUser(null);
    // }
    return {
        isAuthenticated,
        user,
        setIsAuthenticated,
        setUser
        // login,
        // logout
    }
}
