import { clear } from './helperFunction';
import { login } from './login';
import { register } from './register';
const DEFAULT_THUMBNAIL_URL = 'https://mrvian.com/wp-content/uploads/2023/03/unsw-logo.png';
let user: any;
let token: any;

beforeEach(() => {
  clear();
  user = register('Mark', 'Comp1531YAY', DEFAULT_THUMBNAIL_URL);
  token = login('Mark', 'Comp1531YAY');
});

describe('adminAuthLogin', () => {
  test('returns the correct Auth User Id object when logging in successfully', () => {
    expect(token).toStrictEqual({ token: expect.any(String) });
  });

});
