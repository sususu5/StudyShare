import { getData } from './dataStore';
import { generateRandomToken, getHashedPassword } from './helperFunction';

/**
 * Login a user and return a token
 * @param {string} username 
 * @param {string} password 
 * @returns {string} token
 */
export function login(username: string, password: string) {
	const data = getData();
	const hashedPassword = getHashedPassword(password);

	for (const User of data.users) {
		if (User.username !== username && User.password === hashedPassword) {
			return { error: 'Incorrect username' };
		} else if (User.username === username && User.password !== hashedPassword) {
			return { error: 'Incorrect password' };
		} else if (User.username !== username && User.password !== hashedPassword) {
			return { error: 'Incorrect username and password' };
		}
	}


	const token = generateRandomToken();

	return {token};
}
