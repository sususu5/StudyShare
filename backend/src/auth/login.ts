import { getData, setData } from '../dataStore';
import { generateRandomToken, getHashedPassword } from '../helperFunction';

/**
 * Login a user and return a token
 * @param {string} username 
 * @param {string} password 
 * @returns {string} token
 */
export async function login(username: string, password: string)
: Promise<{ token: string } | { error: string }> {
	const data = await getData();
	const hashedPassword = getHashedPassword(password);

	let user = null;
	
	// find user
	user = data.users.find(u => u.username === username);

	// check for errors 
	if (!user) {
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
