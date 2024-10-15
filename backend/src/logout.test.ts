import { login } from './login';
import { logout } from './logout';
import { register } from './register';
import { clear } from "./helperFunction";
let user: any;
let loginreturn: any;

const DEFAULT_THUMBNAIL_URL = 'https://mrvian.com/wp-content/uploads/2023/03/unsw-logo.png';

beforeEach(() => {
	clear();
  user = register('Mark', 'Comp1531YAY', DEFAULT_THUMBNAIL_URL);
  loginreturn = login('Mark', 'Comp1531YAY');
});
afterAll(() => {
  clear();
});

test('succesful logout', () => {
	expect(logout(loginreturn.token)).toStrictEqual({});
});

test('invalid token', () => {
	expect(logout('abc')).toStrictEqual({ error: expect.any(String) });
});

