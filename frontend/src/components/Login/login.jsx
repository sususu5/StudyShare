import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import ReactModal from 'react-modal';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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
        setErrorMessage('Login failed.');
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setErrorMessage('');
      navigate('/');
      window.location.reload();
    } catch (error) {
      setErrorMessage('Invalid login credentials');
      console.error('Login error: ', error);
    }
  };

  const navigateToRegister = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append('username', registerUsername);
      formData.append('password', registerPassword);
      if (avatar) {
        const avatarUrl = URL.createObjectURL(avatar);
        formData.append('avatar', avatarUrl);
      }

      const response = await fetch(`http://localhost:5173/api/register`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        setErrorMessage('Registration failed.');
        throw new Error('Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setErrorMessage('');
      setSuccessMessage('Registration successful!'); // 设置成功消息
      setTimeout(() => {
        setSuccessMessage('');
        closeRegisterModal(); // 自动关闭注册窗口
      }, 3000); // 3秒后关闭
    } catch (error) {
      setErrorMessage('Registration error');
      console.error('Registration error: ', error);
    }
  };

  return (
    <div className="details">
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
      <button className="enter" onClick={handleLogin}>Login</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <p className="register-link-content">
        Don&apos;t you have an account? 
        <button className="register-link" onClick={navigateToRegister}>Sign up</button>
      </p>

      {isRegisterModalOpen && (
        <ReactModal
          isOpen={isRegisterModalOpen}
          onRequestClose={closeRegisterModal}
          contentLabel="Register"
          style={{
            content: {
              width: '30%',
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#646cff',
              borderRadius: '10px',
              padding: '20px',
            },
          }}
        >
          <span className="close" onClick={closeRegisterModal}>&times;</span>
          <h2 style={{ fontFamily: 'Roboto', marginTop: '1px' }}>Register</h2>
          <div className="register-input">
            <input
              type="text"
              placeholder="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              style={{ height: '20px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', padding: '10px' }}
            />
          </div>
          <div className="register-input">
            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              style={{ height: '20px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}
            />
          </div>
          <div className="register-input-file">
            <label htmlFor="avatar-upload" className="custom-file-upload">
              Choose your avatar
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              style={{ display: 'none' }} // Hide the default file input
            />
          </div>
          {/* Add a submit button and handle registration logic */}
          <button onClick={handleRegister} style={{ fontFamily: 'Roboto', marginLeft: '38%' }}>Submit</button>
        </ReactModal>
      )}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* 显示成功消息 */}
    </div>
  )
}
export default Login;
