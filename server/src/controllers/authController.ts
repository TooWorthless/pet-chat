import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user: IUser = new User({ username, email, password: hashedPassword });
        await user.save();
        
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
