import { clear } from '../helperFunction';
import { login } from '../auth/login';
import { register } from '../auth/register';
const DEFAULT_THUMBNAIL_URL = 'https://i.pinimg.com/736x/bf/4f/6d/bf4f6d3010d3ecdfb3eb6770f420dde9.jpg';
let token: any;

beforeEach(() => {
  clear();
});
afterAll(() => {
  clear();
});

let userToken: any;

beforeEach(() => {
  userToken = register('Mark', 'Comp1531YAY', DEFAULT_THUMBNAIL_URL);
});

describe('adminAuthLogin', () => {
  test('returns the correct Auth User Id object when logging in successfully', () => {
    token = login('Mark', 'Comp1531YAY');
    expect(token).toStrictEqual({ token: expect.any(String) });
  });

  test('returns an error when logging in with incorrect password', () => {
    token = login('Mark', 'Comp1531YAY123');
    expect(token).toStrictEqual({ error: 'Incorrect password.' });
  });

  test('returns an error when logging in with incorrect username', () => {
    token = login('Mark123', 'Comp1531YAY');
    expect(token).toStrictEqual({ error: 'Incorrect username.' });
  });
});