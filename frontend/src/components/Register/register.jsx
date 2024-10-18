import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';

function Register() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (username, password, avatar) => {
    try {
      const response = await fetch(`/api/register`, { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, avatar })
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const extension = event.target.files[0].type;
    console.log('EXTENSION IS ', extension);
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      if (selectedFile.size > 3 * 1024 * 1024) {
        alert('File size cannot exceed 3MB');
        setFileName('');
        setFile(null);
        return;
      }
      if (!("image/png" == extension || extension == "image/jpg" || extension == "image/jpeg")) {
        alert('Invalid file format, only jpeg or png accepted.');
        setFileName('');
        setFile(null);
        return;
      }
    }
  };

  return (
    <div className="details">
      <div className="userinput">
        <h1 className="header">Register a new account</h1>
        <div className="username">
          <input className="userbox"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="password">
          <input className="passbox"
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />  
        </div>
        
        <div className="rec">
          {fileName ? (<p className="file-name">Selected file: {fileName}</p>) :
            (<b>Upload an avatar (optional): </b>)
          }
          <label htmlFor="file" className="choose-file">Choose File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      <button className="enter" onClick={(e) => handleRegister(username, password, file)}>Register</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  )
}
export default Register;