  import { setData, getData } from '../dataStore';
import { containsValidName } from '../helperFunction';
/**
 * Update the user's details
 * @param token 
 * @param username 
 * @param avatar 
 * @return empty object
 */
export async function updateUserDetails(userId: number, username: string, avatar: string) {
    const data = await getData();
    const user = data.users.find(u => u.userId === userId);
    if (!user) {
        return { error: 'Invalid token' };
    }
    if (!containsValidName(username)) {
        return {
          error: 'username contains restricted characters.'
        };
    }
    user.username = username;
    user.avatar = avatar;

    setData(data);
    return {};
}