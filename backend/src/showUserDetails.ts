import { UserDetails } from './interface';
import { getData } from './dataStore';
/**
 * Given an admin user's userId, return details about the user.
 * "name" is the first and last name concatenated with a single space between them.
 * @param {string} token user's token
 * @returns {Object} An object containing the id of the newly user.
 */
export function showUserDetails(token: string): { user: UserDetails } {
    const data = getData();
    const user = data.users.find(u => u.token.includes(token));
  
    const userdetail = {
      userId: user.userId,
      username: user.username,
      avatar: user.avatar,
    };
  
    return { user: userdetail };
  }