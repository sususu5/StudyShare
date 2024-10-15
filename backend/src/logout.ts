import { getData, setData } from './dataStore';

/**
 * Logout a user and return an empty object
 * @param {string} token 
 * @returns {object} empty object
 */
export function logout(token: string): object {
	const data = getData();

	let user = null; 

	// find user
	for (const User of data.users) {
		if (User.token.includes(token)) {
			user = User;
			break;
		}
	}

	// check for error
	if (user === null) {
		return { error: 'Invalid token.' };
	}

	// remove token and save
	user.token = user.token.filter(usertoken => usertoken !== token);
	setData(data);

	return {};
}
