import { getData, setData } from './dataStore';
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

	let user = null;
	
	// find user
	for (const User of data.users) {
		if (User.username === username) {
			user = User;
			break;
		}
	}

	// check for errors 
	if (user === null) {
		return { error: 'Incorrect username.' };
	}
	if (user.password !== hashedPassword) {
		return { error: 'Incorrect password.'};
	}

	// make and save token 
	const token = generateRandomToken();
	user.token.push(token);
	setData(data);

	return { token };
}
