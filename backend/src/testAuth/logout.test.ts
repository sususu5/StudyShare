import { logout } from '../auth/logout';
import { register } from '../auth/register';
import { clear } from "../helperFunction";

const DEFAULT_THUMBNAIL_URL = 'https://i.pinimg.com/736x/bf/4f/6d/bf4f6d3010d3ecdfb3eb6770f420dde9.jpg';

beforeEach(() => {
  clear();
});
afterAll(() => {
  clear();
});

let userToken: any;

beforeEach(async () => {
  userToken = await register('Mark', 'Comp1531YAY', DEFAULT_THUMBNAIL_URL);
});

test('succesful logout', async () => {
	expect(await logout(userToken.token)).toStrictEqual({});
});

test('invalid token', async () => {
	expect(await logout('abc')).toStrictEqual({ error: expect.any(String) });
});

