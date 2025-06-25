const { sendError } = require("../utils/helper");
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuth = () => async (req, res, next) => {
    const token = req.header?.authorization;

    const jwtToken = token.split('Bearer ')[1];

    if(!jwtToken) return sendError(res, 'Invalid token!');
    const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
    //jwt.verify(...) 返回的是一个包含 userId 的对象，而不是 userId 本身。所以必须解构：
    const {userId} = decode;

    const user = await User.findById(userId);//对象，它是一个 Mongoose 文档对象（Document），其字段（属性）就是在 userSchema 中定义的那些
    if(!user) return sendError(res, 'Invalid token! User not found!', 404);

    req.user = user;//把认证后的用户信息 user 添加到请求对象上，然后交给下一个中间件或路由处理函数继续处理（给请求加一个字段叫user）
    next();
};