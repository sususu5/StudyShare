import crypto from 'crypto';
import { Data } from './interface';
import { setData } from './dataStore';
// defined constants
const minPassLength = 8;

/**
 * This function clears all data in the dataStore
 * @returns an empty object
 */
export function clear(): Record<string, never> {
  setData({
    users: [],
    notes: []
  });
  return {};
}


/**
 * This function returns a random token
 * @returns {string} token
 */
export function generateRandomToken() {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * This function returns the hashed password of the given password
 * @param password
 * @returns the hashed password
 */
export function getHashedPassword(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// checks if str contains characters other than lower/upper case letters
// spaces, hyphens or apostrophes --> false
export function containsValidName(str: string) {
return /^[A-za-z '-]+$/.test(str);
}

// checks if str does not contain at least one letter
export function hasLetter(str: string) {
return (/[A-za-z]/.test(str));
}

export function validPassword(password: string) {
	// if password is less than 8 characters --> error
  if (password.length < minPassLength) {
    return false;
  }

  // if password does not contain at least one number and at least
  // one letter --> error
  if (!hasLetter(password) || !containsNumber(password)) {
    return false;
  }

	return true; 
}
  
// checks if str does not contain at least one number
export function containsNumber(str: string) {
  return /\d/.test(str);
}

/**
This function generates a random user ID
@returns a random user ID
*/
export function generateRandomUserId(data: Data): number {
  // Generate a random number between 1000000000 and 9999999999
  let userId = Math.floor(Math.random() * 9000000000) + 1000000000;
  // Check if the userId already exists
  // find user with the same userId in userId array
  while (data.users.find(User => User.userId === userId)) {
    userId = Math.floor(Math.random() * 9000000000) + 1000000000;
  }
  return userId;
}