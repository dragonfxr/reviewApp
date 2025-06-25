import { useContext } from "react"
import { ThemeContext } from "../components/context/ThemeProvider"
import { NotificationContext } from "../components/context/NotificationProvider";
import { AuthContext } from "../components/context/AuthProvider";

//组件“包在 Provider 里”只是让它具备访问权限，但你仍然需要 useContext(...) 来真正访问上下文里的值（比如用户信息、登录函数等）。
export const useTheme = () => {
    return useContext(ThemeContext);
};

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const useAuth = () => {
    return useContext(AuthContext);
};