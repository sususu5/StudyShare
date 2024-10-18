import { getData, setData } from '../dataStore';

/**
 * Logout a user and return an empty object
 * @param {string} token 
 * @returns {object} empty object
 */
export async function logout(token: string): Promise<Record<string, string>> {
	const data = await getData();

	// find user
	const user = data.users.find(User => User.token.includes(token));

	// check for error
	if (!user) {
		return { error: 'Invalid token.' };
	}

	// remove token and save
	user.token = user.token.filter(usertoken => usertoken !== token);
	await setData(data);

	return {};
}
