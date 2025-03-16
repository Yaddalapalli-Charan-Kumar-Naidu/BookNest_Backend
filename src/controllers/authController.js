import User from "../models/user.js";
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15d' });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        // Assuming `isPasswordMatch` is a method in the User model
        const isPasswordMatch = await user.isPasswordMatch(password);

        if (!isPasswordMatch) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const register = async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ message: "Fill the mandatory fields" });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Account already exists" });
        }

        const profileImage = `https://api.dicebear.com/9.x/initials/svg?seed=${username}`;

        // Create a new user (password hashing is handled in the model)
        const newUser = new User({
            username,
            password, // Password will be hashed by the pre-save hook in the model
            email,
            profileImage,
        });

        const savedUser = await newUser.save();
        const token = generateToken(savedUser._id);

        res.status(201).json({
            token,
            user: {
                username: savedUser.username,
                email: savedUser.email,
                _id: savedUser._id,
                profileImage: savedUser.profileImage,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export { login, register };