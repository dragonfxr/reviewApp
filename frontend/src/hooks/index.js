import { useContext } from "react"
import { ThemeContext } from "../components/context/ThemeProvider"
import { NotificationContext } from "../components/context/NotificationProvider";

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const useNotification = () => {
    return useContext(NotificationContext);
};