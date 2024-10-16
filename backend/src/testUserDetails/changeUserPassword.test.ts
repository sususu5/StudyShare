import { changeUserPassword } from "../user/changeUserPassword";
import { register } from "../auth/register";
import { clear } from "../helperFunction";
const DEFAULT_THUMBNAIL_URL = 'https://i.pinimg.com/736x/bf/4f/6d/bf4f6d3010d3ecdfb3eb6770f420dde9.jpg';
let user1Token: { token: string } | { error: string };

beforeEach(() => {
  clear();
});
afterAll(() => {
  clear();
});

beforeEach(() => {
  user1Token = register('Mark', 'Comp1531YAY', DEFAULT_THUMBNAIL_URL);
});

describe('changeUserPassword', () => {
  test('Invalid token', () => {
    const updatedUser = changeUserPassword('Invalid token', 'Comp1531YAY', 'Comp1531YAY123');
    expect(updatedUser).toStrictEqual({ error: 'Invalid token' });
  });

  test('Wrong old password', () => {
    if ('token' in user1Token) {
      const updatedUser = changeUserPassword(user1Token.token, 'Comp1531YA', 'Comp1531YAY123');
      expect(updatedUser).toStrictEqual({ error: 'Wrong old password' });
    }
  });

  test('same as old password', () => {
    if ('token' in user1Token) {
      const updatedUser = changeUserPassword(user1Token.token, 'Comp1531YAY', 'Comp1531YAY');
      expect(updatedUser).toStrictEqual({ error: 'Invalid password' });
    }
  });

  test('Invalid password', () => {
    if ('token' in user1Token) {
      const updatedUser = changeUserPassword(user1Token.token, 'Comp1531YAY', 'C');
      expect(updatedUser).toStrictEqual({ error: 'Invalid password' });
    }
  });

  test('Valid password', () => {
    if ('token' in user1Token) {
      const updatedUser = changeUserPassword(user1Token.token, 'Comp1531YAY', 'Comp1531YAY123');
      expect(updatedUser).toStrictEqual({});
    }
  });
});

