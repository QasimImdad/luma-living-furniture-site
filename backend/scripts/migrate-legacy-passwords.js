import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { isBcryptPasswordHash } from '../lib/passwords.js';

const batchSize = 100;
const passwordRounds = 12;

async function main() {
    const requiredSettings = ['DBHOST', 'DBUSER', 'DBNAME'];
    if (requiredSettings.some((key) => !process.env[key])) {
        throw new Error('DBHOST, DBUSER, and DBNAME must be configured.');
    }

    const connection = await mysql.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME,
    });

    let migrated = 0;
    let lastId = 0;
    let transactionOpen = false;

    try {
        while (true) {
            await connection.beginTransaction();
            transactionOpen = true;
            const [users] = await connection.execute(
                'SELECT id, password FROM users WHERE id > ? ORDER BY id LIMIT ? FOR UPDATE',
                [lastId, batchSize],
            );

            if (users.length === 0) {
                await connection.commit();
                transactionOpen = false;
                break;
            }

            const legacyUsers = users.filter((user) => !isBcryptPasswordHash(user.password));
            if (legacyUsers.some((user) => Buffer.byteLength(user.password, 'utf8') > 72)) {
                throw new Error("A legacy password exceeds bcrypt's 72-byte limit; no changes were committed for its batch.");
            }

            for (const user of legacyUsers) {
                const passwordHash = await bcrypt.hash(user.password, passwordRounds);
                const [result] = await connection.execute(
                    'UPDATE users SET password = ? WHERE id = ? AND password = ?',
                    [passwordHash, user.id, user.password],
                );
                if (result.affectedRows !== 1) {
                    throw new Error('A user password changed during migration; rerun after resolving concurrent updates.');
                }
            }

            await connection.commit();
            transactionOpen = false;
            migrated += legacyUsers.length;
            lastId = users[users.length - 1].id;
        }
    } catch (error) {
        if (transactionOpen) await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }

    console.log(`Migrated ${migrated} legacy password(s) to bcrypt.`);
}

main().catch((error) => {
    console.error('Legacy password migration failed:', error.message);
    process.exitCode = 1;
});
