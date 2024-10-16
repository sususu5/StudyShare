import { updateUserDetails } from '../user/updateUserDetails';
import { register } from '../auth/register';
import { showUserDetails } from '../user/showUserDetails';
import { clear } from '../helperFunction';

const DEFAULT_THUMBNAIL_URL = 'https://i.pinimg.com/736x/bf/4f/6d/bf4f6d3010d3ecdfb3eb6770f420dde9.jpg';
const NEW_THUMBNAIL_URL = 'https://i.pinimg.com/736x/42/bd/42/42bd4281419cabac8b01f29dd87b263d.jpg';

beforeEach(() => {
  clear();
});
afterAll(() => {
  clear();
});

let user1Token: { token: string } | { error: string };

beforeEach(() => {
  user1Token = register('Mark', 'Comp1531YAY', DEFAULT_THUMBNAIL_URL);
});

describe('updateUserDetails', () => {
  test('has the correct return type if no error', () => {
    expect(user1Token).toStrictEqual({ token: expect.any(String) });

    if ('token' in user1Token) {
      const updatedUser = updateUserDetails(user1Token.token, 'Mike', NEW_THUMBNAIL_URL);
      expect(updatedUser).toStrictEqual({});

      const userDetails = showUserDetails('Mike');
      expect(userDetails).toStrictEqual({
        user: {
          userId: expect.any(Number),
          username: 'Mike',
          avatar: NEW_THUMBNAIL_URL
        }
      });
    }
  });

  test('Invalid token', () => {
    const updatedUser = updateUserDetails('Invalid token', 'Mike', NEW_THUMBNAIL_URL);
    expect(updatedUser).toStrictEqual({ error: 'Invalid token' });
  });

  test('Username contains restricted characters', () => {
    if ('token' in user1Token) {
      const updatedUser = updateUserDetails(user1Token.token, 'Mike!', NEW_THUMBNAIL_URL);
      expect(updatedUser).toStrictEqual({ error: 'username contains restricted characters.' });
    }
  });
});
