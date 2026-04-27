import jwt from 'jsonwebtoken';
const createToken = (res, user) => {
const userId = typeof user === 'object' && user !== null ? user._id : user;
const token = jwt.sign({ id: userId },
     process.env.JWT_SECRET, 
     { expiresIn: '30d' });
     
     res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }); 

  return token;
};
export default createToken;

