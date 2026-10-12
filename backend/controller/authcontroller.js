import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';
import { isBcryptPasswordHash } from '../lib/passwords.js';

const pool = db.promise();
const passwordRounds = 12;

function cleanString(value, maxLength) {
    if (typeof value !== 'string') return null;
    const cleaned = value.trim();
    return cleaned && cleaned.length <= maxLength ? cleaned : null;
}

export const registerfunc = async (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const name = cleanString(body.name, 60);
    const phone = cleanString(body.phone, 13);
    const email = cleanString(body.email, 140)?.toLowerCase();
    const gender = cleanString(body.gender, 11);
    const address = cleanString(body.address, 5000);
    const password = body.password;

    if (
        !name || !phone || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        || !gender || !address || typeof password !== 'string'
        || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72
    ) {
        return res.status(400).json({
            status: false,
            message: 'Enter valid profile details and a password between 12 and 72 bytes.',
        });
    }

    try {
        const passwordHash = await bcrypt.hash(password, passwordRounds);
        await pool.execute(
            `INSERT INTO users (name, phone, email, gender, address, password, created_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [name, phone, email, gender, address, passwordHash],
        );
        return res.status(201).json({ status: true, message: 'User registered.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ status: false, message: 'An account with that email already exists.' });
        }
        console.error('Registration failed:', error.message);
        return res.status(500).json({ status: false, message: 'Unable to register the account.' });
    }
};

export const loginfunc = async (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const email = cleanString(body.email, 140)?.toLowerCase();
    const password = body.pass;
    if (!email || typeof password !== 'string' || !password || Buffer.byteLength(password, 'utf8') > 72) {
        return res.status(400).json({ status: false, message: 'Email and password are required.' });
    }

    try {
        const [users] = await pool.execute(
            'SELECT id, name, email, gender, password FROM users WHERE email = ? AND deleated_at IS NULL LIMIT 1',
            [email],
        );
        const user = users[0];
        if (!user) return res.status(401).json({ status: false, message: 'Invalid credentials.' });

        if (!isBcryptPasswordHash(user.password) || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: false, message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '2d', algorithm: 'HS256' },
        );
        const publicUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
        };
        return res.json({ status: true, message: 'User data', token, User: publicUser });
    } catch (error) {
        console.error('Login failed:', error.message);
        return res.status(500).json({ status: false, message: 'Unable to log in.' });
    }
};

export const editUser = async (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const name = cleanString(body.name, 60);
    const email = cleanString(body.email, 140)?.toLowerCase();
    const gender = cleanString(body.gender, 11);
    const address = cleanString(body.address, 5000);

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !gender || !address) {
        return res.status(400).json({ status: false, message: 'Enter valid profile details.' });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE users SET name = ?, address = ?, email = ?, gender = ?, updated_at = NOW() WHERE id = ? AND deleated_at IS NULL',
            [name, address, email, gender, req.user.id],
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: false, message: 'User not found or profile unchanged.' });
        }
        return res.json({ status: true, message: 'User data updated.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ status: false, message: 'An account with that email already exists.' });
        }
        console.error('Profile update failed:', error.message);
        return res.status(500).json({ status: false, message: 'Unable to update the profile.' });
    }
};
