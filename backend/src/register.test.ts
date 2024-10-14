
import { register } from './register';

describe('adminAuthRegister', () => {
  // Successful test with valid inputs
  test('has the correct return type if no error', () => {
    const user1 = register('Mark', 'Comp1531YAY');
    expect(user1).toStrictEqual({ token: expect.any(String) });
  });


  // testing for nameFirst and nameLast length
  test.each([
    // nameFirst too short
    {
      username: 'M',
      password: 'Comp1531YAY'
    },
    // nameFirst too long
    {
      username: 'Markmarkmarkmarkmarkmark',
      password: 'Comp1531YAY'
    }
    
  ])('returns an error for invalid name length',
    ({ username, password }) => {
      const errorAdmin = register(username, password);
      expect(errorAdmin).toStrictEqual({ error: expect.any(String) });
    });

  // Password must contains at least one number and at least one letter
  test.each([
    // Password doesn't contain at least one number
    {
      username: 'Mark',
      password: 'CompYAYAYAYA'
    },
    // Password doesn't contain at least one letter
    {
      username: 'Mark',
      password: '153115311531'
    },
  ])('returns an error for password missing required character types',
    ({ username, password }) => {
      const errorAdmin = register(username, password);
      expect(errorAdmin).toStrictEqual({ error: expect.any(String) });
    });

});