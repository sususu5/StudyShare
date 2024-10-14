import crypto from 'crypto';

/**
 * This function returns a random token
 * @returns {string} token
 */
export function generateRandomToken() {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * This function returns the hashed password of the given password
 * @param password
 * @returns the hashed password
 */
export function getHashedPassword(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex');
}