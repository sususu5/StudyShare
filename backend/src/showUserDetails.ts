import { UserDetails } from './interface';
import { getData } from './dataStore';
/**
 * Given an admin user's userId, return details about the user.
 * 
 * @param {number} userId
 * @returns {Object} An object containing the details of the user.
 */
export function showUserDetails(userId: number): { user: UserDetails } | { error: string } {
    const data = getData();
    const user = data.users.find(u => u.userId === userId);
		if (!user) {
			return { error: 'User not found' };
		}
  
    const userdetail = {
      userId: user.userId,
      username: user.username,
      avatar: user.avatar,
    };
  
    return { user: userdetail };
  }