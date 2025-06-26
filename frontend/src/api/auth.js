import client from "./client";

export const createUser = async (userInfo) => {
    try {
        const {data} = await client.post('/user/create', userInfo); // data: userInfo
        return data;
    } catch (error) {
        // console.log(error.response?.data);
        const {response} = error;
        if (response?.data) return response.data;

        return {error: error.message || error};
    };
};

export const verifyUserEmail = async (userInfo) => {
    try {
        const {data} = await client.post('/user/verify-email', userInfo); // data: userInfo
        return data;
    } catch (error) {
        // console.log(error.response?.data);
        const {response} = error;
        if (response?.data) return response.data;

        return {error: error.message || error};
    };
};

export const signInUser = async (userInfo) => {
    try {
        const {data} = await client.post('/user/sign-in', userInfo); // data: userInfo
        return data;
    } catch (error) {
        // console.log(error.response?.data);
        const {response} = error;
        if (response?.data) return response.data;

        return {error: error.message || error};
    };
};

export const getIsAuth = async (token) => {
    try {
        const {data} = await client.get('/user/is-auth', {
            headers:{//HTTP header 名字大小写不敏感。Authorization 和 Accept 是 HTTP 的标准字段名，必须保持不变，否则后端识别不到
                Authorization:'Bearer ' + token,
                accept: 'application/json',
            },
        }); // data: userInfo
        return data;
    } catch (error) {
        // console.log(error.response?.data);
        const {response} = error;
        if (response?.data) return response.data;

        return {error: error.message || error};
    };
};