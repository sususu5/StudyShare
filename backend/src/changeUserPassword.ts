import { setData, getData } from './dataStore';
import { getHashedPassword } from './helperFunction';
/**
 * Change the user's password
 * @param token 
 * @param password 
 * @return empty object
 */
export function changeUserPassword(token: string, oldPassword: string, newPassword: string) {
    const data = getData();
    const user = data.users.find(u => u.token.includes(token));
    // validate the old password
    if (user.password !== getHashedPassword(oldPassword)) {
        return { error: 'Wrong old password' };
    }
    // validate the new password
    if (!validatePassword(newPassword)) {
        return { error: 'Invalid password' };
    } else {
        user.password = getHashedPassword(newPassword);
    }
    user.usedPassword.push(oldPassword);
    setData(data);
    return {};
}