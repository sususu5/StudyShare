import { getData, setData } from '../dataStore';

/**
 * Logout a user and return an empty object
 * @param {string} token 
 * @returns {object} empty object
 */
export function logout(token: string): Record<string, string> {
	const data = getData();

	// find user
	const user = data.users.find(User => User.token.includes(token));

	// check for error
	if (!user) {
		return { error: 'Invalid token.' };
	}

	// remove token and save
	user.token = user.token.filter(usertoken => usertoken !== token);
	setData(data);

	return {};
}
