import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import createToken from '../utils/createToken.js';

const createUser = asyncHandler(async  (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(404).json({ message: 'Please provide name, email, and password' });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
    }
        //Create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    try {        
        await newUser.save();
        createToken(res, newUser._id);
        res.status(201).json({
            message: 'User created successfully',
            user: { _id: newUser._id, name, email, isAdmin: newUser.isAdmin }
        });
        console.log(`User created successfully with name: ${name} and email: ${email} `);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating user', error: error.message });
    }

}  );

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        if(!email){
            return res.status(404).json({ message: 'Please  provide email' });

        }else if(!password){
            return res.status(404).json({ message: 'Please  provide password' });
        }else{
            return res.status(404).json({ message: 'Please provide email and password' });
        }
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    createToken(res, user._id);
    res.status(200).json({
        message: 'Login successful',
        user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
 }
);

const logoutUser = asyncHandler(async (req, res) => {
        res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    console.log('User logged out successfully');
    res.status(200).json({ message: 'Logout successful' });
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
});

const getCurrentUserProfile = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
const currentUser = await User.findById(userId);
if(currentUser){
    res.json({
        _id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        isAdmin: currentUser.isAdmin
    });
} else {
     res.status(404).json({ message: 'User not found' });
     throw new Error('User not found');
}
});
const updateUserProfile = asyncHandler(async(req,res)=>{

    const userId = req.user._id;
    const { name, email, password, confirmPassword } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Both password and confirmPassword are REQUIRED
    if (!password || !confirmPassword) {
        return res.status(400).json({ message: 'Both password and confirm password are required' });
    }

    // Validate passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.status(200).json({
        message: 'Profile updated successfully',
        user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
});

    const deleteUserProfile = asyncHandler(async(req,res)=>{
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    });

    const deleteOneUser = asyncHandler(async(req,res)=>{
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    });

    const makeUserAdmin = asyncHandler(async(req,res)=>{
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isAdmin = true;
        await user.save();
        res.status(200).json({ message: 'User promoted to admin successfully' });
    });


export  { createUser , loginUser , logoutUser , getAllUsers, 
    getCurrentUserProfile, updateUserProfile , deleteUserProfile, deleteOneUser, makeUserAdmin};