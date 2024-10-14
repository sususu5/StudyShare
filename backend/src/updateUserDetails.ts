import { setData, getData } from './dataStore';
/**
 * Update the user's details
 * @param token 
 * @param username 
 * @param avatar 
 * @return empty object
 */
export function updateUserDetails(token: string, username: string, avatar: string) {
    const data = getData();
    const user = getData().users.find(u => u.token.includes(token));
    user.username = username;
    user.avatar = avatar;

    setData(data);
    return {};
}