import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setErrorMessage('');
      navigate('/');
      window.location.reload();
    } catch (error) {
      setErrorMessage(`${error}`);
      console.error(error);
    }
  };

  return (
    <div className="input">
      <div className="userinput">
        <h1 className="header">Log in</h1>
        <div className="username">
          <input className="userbox"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="password">
          <input className="passbox"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="registerlink">
        Don&apos;t have an account? 
        <a href="/register"> Register here</a>
      </div>
      
      <button className="enter" onClick={() => handleLogin(username, password)}>Login</button>
      {errorMessage && <p style={{ color: '#ff4d88' }}>{errorMessage}</p>}
    </div>
  )
}
export default Login;
