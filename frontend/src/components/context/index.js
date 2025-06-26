import React from 'react'
import AuthProvider from './AuthProvider'
import ThemeProvider from "./ThemeProvider";
import NotificationProvider from "./NotificationProvider";

//组件“包在 Provider 里”只是让它具备访问权限，但你仍然需要 useContext(...) 来真正访问上下文里的值（比如用户信息、登录函数等）。
export default function ContextProviders({children}) {
  return (
    <AuthProvider>
      <NotificationProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </NotificationProvider>
    </AuthProvider>
  )
}
