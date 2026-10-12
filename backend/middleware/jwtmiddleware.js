import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { status: false, message: 'Too many authentication attempts. Try again later.' },
});

export const jwtMiddleware = (req, res, next) => {
    const [scheme, token, ...extra] = (req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token || extra.length > 0) {
        return res.status(401).json({ status: false, message: 'A bearer token is required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        if (!Number.isSafeInteger(decoded.id) || decoded.id < 1) {
            return res.status(401).json({ status: false, message: 'Invalid token.' });
        }
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ status: false, message: 'Invalid token.' });
    }
};