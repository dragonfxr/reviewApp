import client from "./client";

export const createUser = async (userInfo) => {
    try {
        const {data} = await client.post('/user/signup', userInfo); // data: userInfo
        return data;
    } catch (error) {
        console.log(error.response?.data);
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
        console.log(error.response?.data);
        const {response} = error;
        if (response?.data) return response.data;

        return {error: error.message || error};
    };
};