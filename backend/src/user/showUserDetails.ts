import { UserDetails } from '../interface';
import { getData } from '../dataStore';
/**
 * Given an admin user's username, return details about the user.
 * 
 * @param {string} username
 * @returns {Object} An object containing the details of the user.
 */
export function showUserDetails(username: string): { user: UserDetails } | { error: string } {
    const data = getData();
    const user = data.users.find(u => u.username === username);
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