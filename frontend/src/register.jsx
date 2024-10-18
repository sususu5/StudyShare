import { useState } from 'react';
//import './register.css';

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`/api/login`, { 
        method: 'POST', 
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        setErrorMessage('Login failed.');
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(`${error}`);
      console.error('Login error: ', error);
    }
  };

  return (
    <div className="details">
      <div className="userinput">
        <h1 class="header">Log in</h1>
        <div className="username">
          <input class="userbox"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="password">
          <input class="passbox"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />  
        </div>
      </div>
      <button class="enter" onClick={handleLogin}>Login</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  )
}
export default Register;