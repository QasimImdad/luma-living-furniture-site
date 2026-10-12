// const express = require('express');
import express from 'express';
// const cors = require('cors');
import cors from 'cors';
import helmet from 'helmet';
import { mkdir, stat } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import 'dotenv/config';
import db from './db/db.js';

const app = express();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || Buffer.byteLength(jwtSecret, 'utf8') < 32) {
    throw new Error('JWT_SECRET must be set to at least 32 bytes.');
}
const requiredDatabaseSettings = ['DBHOST', 'DBUSER', 'DBNAME'];
if (requiredDatabaseSettings.some((key) => !process.env[key])) {
    throw new Error('DBHOST, DBUSER, and DBNAME must be configured.');
}
const allowedOrigins = new Set(
    (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
);
const uploadDirectory = join(dirname(fileURLToPath(import.meta.url)), 'uploads');
const optimizedImageDirectory = join(tmpdir(), 'luma-living-product-images');
const imageWidths = { card: 640, detail: 1440 };
const imageOptimizationJobs = new Map();

async function getOptimizedImagePath(sourcePath, relativeSourcePath, variant) {
    const sourceStats = await stat(sourcePath);
    const optimizedPath = resolve(
        optimizedImageDirectory,
        `${relativeSourcePath}.${variant}.jpg`,
    );

    try {
        const optimizedStats = await stat(optimizedPath);
        if (optimizedStats.mtimeMs >= sourceStats.mtimeMs) return optimizedPath;
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }

    const jobKey = `${optimizedPath}:${sourceStats.mtimeMs}`;
    let optimization = imageOptimizationJobs.get(jobKey);
    if (!optimization) {
        optimization = (async () => {
            await mkdir(dirname(optimizedPath), { recursive: true });
            await sharp(sourcePath)
                .rotate()
                .resize({ width: imageWidths[variant], withoutEnlargement: true })
                .flatten({ background: '#ffffff' })
                .jpeg({ quality: 80, progressive: true })
                .toFile(optimizedPath);
        })();
        imageOptimizationJobs.set(jobKey, optimization);
    }

    try {
        await optimization;
    } finally {
        if (imageOptimizationJobs.get(jobKey) === optimization) {
            imageOptimizationJobs.delete(jobKey);
        }
    }

    return optimizedPath;
}

import productRouter from './routes/productroutes.js'
import cartRouter from './routes/cartroutes.js'
import authRouter from './routes/authroutes.js'
import orderRouter from './routes/orderroutes.js'

app.use(helmet());
app.use(cors({
    origin(origin, callback) {
        callback(null, !origin || allowedOrigins.has(origin));
    },
}));
app.use(express.json({ limit: '32kb' }));

app.get('/uploads/*imagePath', async (req, res, next) => {
    const { variant } = req.query;
    if (variant === undefined) return next();
    if (typeof variant !== 'string' || !Object.hasOwn(imageWidths, variant)) {
        return res.status(400).json({ status: false, message: 'A valid image variant is required.' });
    }

    const imagePath = Array.isArray(req.params.imagePath)
        ? req.params.imagePath
        : [req.params.imagePath];
    const sourcePath = resolve(uploadDirectory, ...imagePath);
    const relativeSourcePath = relative(uploadDirectory, sourcePath);
    if (
        !relativeSourcePath
        || relativeSourcePath === '..'
        || relativeSourcePath.startsWith(`..${sep}`)
        || isAbsolute(relativeSourcePath)
    ) {
        return res.status(400).json({ status: false, message: 'Invalid image path.' });
    }
    if (!/\.(?:jpe?g|png|webp)$/i.test(sourcePath)) {
        return res.status(415).json({ status: false, message: 'Unsupported image format.' });
    }

    try {
        const optimizedPath = await getOptimizedImagePath(
            sourcePath,
            relativeSourcePath,
            variant,
        );
        res.set('Cache-Control', 'public, max-age=3600');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        return res.sendFile(optimizedPath, (error) => {
            if (error) next(error);
        });
    } catch (error) {
        if (error.code === 'ENOENT') return next();
        return next(error);
    }
});

app.use('/uploads', (req, res, next) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(uploadDirectory));

app.use('/api/v1/products' , productRouter);
app.use('/api/v1/cart' , cartRouter);
app.use('/api/v1/orders', orderRouter);

app.use('/api/v1/user', authRouter);

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === 'entity.too.large') {
        return res.status(413).json({ status: false, message: 'Request body is too large.' });
    }
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({ status: false, message: 'Request body must be valid JSON.' });
    }
    console.error('Unhandled request error:', error.message);
    return res.status(500).json({ status: false, message: 'An unexpected server error occurred.' });
});

const port = Number(process.env.PORT) || 3000;
if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port.');
}

db.promise().query('SELECT 1')
    .then(() => {
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    })
    .catch(() => {
        console.error('Startup failed; verify the database configuration and that MySQL is running.');
        process.exitCode = 1;
    });