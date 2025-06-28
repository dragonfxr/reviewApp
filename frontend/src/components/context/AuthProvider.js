import React, { createContext, useState } from 'react';
import { getIsAuth, signInUser } from '../../api/auth';
import { useEffect } from 'react';
import { useNotification } from '../../hooks';

export const AuthContext = createContext();

const defaultAuthInfo = {
    profile: null, 
    isLoggedIn: false,
    isPending: false,
    error:''
}

export default function AuthProvider({children}) { //default 让它可以默认导出，否则导入的时候需要用花括号导入
  //组件或模块主角 → 用 default export；
  //多个函数/工具/配置 → 用 named export。
  const { updateNotification } = useNotification();

  const [authInfo, setAuthInfo] = useState({
      ...defaultAuthInfo
  });

  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true });
    const { error, user } = await signInUser({ email, password });
    if (error) {
      updateNotification('error', error);
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: "",
    });

    localStorage.setItem("auth-token", user.token);
  };

  const isAuth = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    setAuthInfo({ ...authInfo, isPending: true });
    const { error, user } = await getIsAuth(token);
    if (error) {
      updateNotification('error', error);
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    setAuthInfo({
      profile: { ...user },
      isLoggedIn: true,
      isPending: false,
      error: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    setAuthInfo({ ...defaultAuthInfo })
  }

  useEffect(() => {
    isAuth();
  }, []);

  //相当于我在组件里定义了一个值叫 authInfo，又定义了一个方法叫 handleLogin，用组件去广播，然后用 useContext 去使用。
  return (
    <AuthContext.Provider value={{ authInfo, handleLogin, isAuth, handleLogout }}>
        {children}
    </AuthContext.Provider>
  )
};
