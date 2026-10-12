import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import jwt from 'jsonwebtoken';
import { jwtMiddleware } from '../middleware/jwtmiddleware.js';

const testSecret = Buffer.alloc(32, 7).toString('base64url');
const originalSecret = process.env.JWT_SECRET;

before(() => {
    process.env.JWT_SECRET = testSecret;
});

after(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
});

function createResponse() {
    return {
        statusCode: 200,
        body: null,
        status(statusCode) {
            this.statusCode = statusCode;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        },
    };
}

test('rejects requests without a bearer token', () => {
    const response = createResponse();
    let nextCalled = false;

    jwtMiddleware({ headers: {} }, response, () => { nextCalled = true; });

    assert.equal(response.statusCode, 401);
    assert.equal(nextCalled, false);
});

test('rejects tokens with an unexpected signing algorithm', () => {
    const token = jwt.sign({ id: 7 }, testSecret, { algorithm: 'HS384' });
    const response = createResponse();

    jwtMiddleware({ headers: { authorization: `Bearer ${token}` } }, response, () => {});

    assert.equal(response.statusCode, 401);
});

test('accepts a valid HS256 token with a positive integer subject', () => {
    const token = jwt.sign({ id: 7 }, testSecret, { algorithm: 'HS256', expiresIn: '1m' });
    const request = { headers: { authorization: `Bearer ${token}` } };
    const response = createResponse();
    let nextCalled = false;

    jwtMiddleware(request, response, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.equal(request.user.id, 7);
});