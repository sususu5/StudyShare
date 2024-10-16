import { useState } from 'react'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`/api/login`, { 
        method: 'POST', 
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
    } catch (error) {
      console.error('Login error: ', error);
    }
  };

  return (
    <div className="login">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="text"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />  
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
export default Login;