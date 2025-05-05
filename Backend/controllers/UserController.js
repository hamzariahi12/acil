import bcrypt  from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto'

export const signup = async (req, res) => {
    try {
        const { name, email, password, role = "client", phone, restaurant } = req.body;
        
        console.log('Attempting to create user with email:', email);
        
        // Validate required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(409).json({ message: 'User already exists with this email' });
        }

        // Validate required fields based on role
        if ((role === 'owner' || role === 'responsable') && !restaurant) {
            return res.status(400).json({ message: 'Restaurant ID is required for owner and responsable roles' });
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role,
            phone,
            restaurant: (role === 'owner' || role === 'responsable') ? restaurant : undefined
        });
        
        console.log('Saving user to database...');
        await user.save();
        console.log('User created successfully:', email);

        res.status(201).json({ 
            message: 'User created successfully', 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'An error occurred during sign-up', error: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        console.log('Attempting login for email:', email);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found, comparing password...');
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Password valid, generating token...');
        const token = jwt.sign({ userId: user._id, role: user.role }, 'secret_key', { expiresIn: '24h' });

        // Decide redirection path based on user role
        let redirectPath;
        switch (user.role) {
            case 'admin':
                redirectPath = '/admin/dashboard';
                break;
            case 'responsable':
                redirectPath = '/responsable/home';
                break;
            default:
                redirectPath = '/client/home';
        }

        console.log('Login successful for user:', email);
        res.status(200).json({ 
            token, 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }, 
            redirectTo: redirectPath 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login', error: error.message });
    }
};



export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming the ID is passed as a route parameter
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};
    export const updateUser = async (req, res) => {
        try {
            const UserId = req.params.id;
            const { name,email, password } = req.body;
            const updatedUser = await User.findByIdAndUpdate(
                UserId,
                req.body,
                { new: true }
            );
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(updatedUser);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
};
export const deleteUser = async (req, res) => {
    try {
        const UserId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(UserId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'user not found' });
        }
        res.json({ message: 'user deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
//reset password

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
        await user.save();

        console.log("Reset token:", token);
        res.status(200).json({ message: 'Reset token generated', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while generating reset token' });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        console.log("Received token:", token);
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while resetting password' });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll(); 
        res.status(200).json({ message: users });
    } catch (error) {
        res.status(500).json({ message: 'hy' });
    }
};

export const findUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Searching for user with email:', email);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', email);
        res.status(200).json({ 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};




// get all users 
// reset password 
// update user 