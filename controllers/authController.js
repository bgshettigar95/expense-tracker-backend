const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

//Register User
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImgUrl } = req.body;

    //Validation Check for missing fields
    if (!fullName || !email | !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if email already in use
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already in use" });
        }

        //Create the User
        const user = await User.create({ fullName, email, password, profileImgUrl });

        return res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        })
    } catch (err) {
        res.status(500).json({ message: 'Error registering the user', error: err.message });
    }
}

//Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    //Validation Check for missing fields
    if (!email | !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if email already in use
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        })
    } catch (err) {
        res.status(500).json({ message: 'Error logging in  the user', error: err.message });
    }

}

//Get User Info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            res.status(400).json({ message: "User not found" })
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching the user', error: err.message });
    }

}