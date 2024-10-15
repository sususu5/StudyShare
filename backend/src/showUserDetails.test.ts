import { showUserDetails } from './showUserDetails';
import { register } from './register';

const DEFAULT_THUMBNAIL_URL = 'https://mrvian.com/wp-content/uploads/2023/03/unsw-logo.png';

describe('showUserDetails', () => {
  test('has the correct return type if no error', () => {
    const user1 = register('Mark', 'Comp1531YAY', DEFAULT_THUMBNAIL_URL);
    expect(user1).toStrictEqual({ token: expect.any(String) });

		const userdetails = showUserDetails('Mark');
		expect(userdetails).toStrictEqual({
			user: {
				userId: expect.any(Number),
				username: 'Mark',
				avatar: DEFAULT_THUMBNAIL_URL
			}
		});
  });
});
