import { UserDetails } from '../interface';
import { getData } from '../dataStore';
/**
 * Given an admin user's username, return details about the user.
 * 
 * @param {number} userId
 * @returns {Object} An object containing the details of the user.
 */
export async function showUserDetails(userId: number): Promise<UserDetails | { error: string }> {
    const data = await getData();
    const user = data.users.find(u => u.userId === userId);
		if (!user) {
			return { error: 'User not found' };
		}
  
    const userdetail = {
      userId: user.userId,
      username: user.username,
      avatar: user.avatar,
    };
  
    return userdetail;
  }