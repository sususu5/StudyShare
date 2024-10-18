import { setData, getData } from '../dataStore';
import { getHashedPassword } from '../helperFunction';
import { validPassword } from '../helperFunction';
/**
 * Change the user's password
 * @param userId 
 * @param password 
 * @return empty object
 */
export async function changeUserPassword(userId: number, oldPassword: string, newPassword: string) {
	const data = await getData();
	const user = data.users.find(u => u.userId === userId);
  if (!user) {
    return { error: 'Invalid token' };
  }
	// validate the old password
	if (user.password !== getHashedPassword(oldPassword)) {
			return { error: 'Wrong old password' };
	}
	// validate the new password
	if (!validPassword(newPassword) || newPassword === oldPassword) {
			return { error: 'Invalid password' };
	}
  const hashedPassword = getHashedPassword(newPassword);
	user.password = hashedPassword;
	user.usedPassword.push(hashedPassword);

	setData(data);
	return {};
}