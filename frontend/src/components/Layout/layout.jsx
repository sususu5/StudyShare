import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import ProfileButton from '../ProfileButton/profileButton';
import './layout.css';

function Layout() {
  const navigate = useNavigate();
  const [user, setUser] = useState('');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('authToken');
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, [user]);

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Logout failed: ${errorData.error}`);
          return;
        }

        // Logout successful
        localStorage.removeItem('authToken');
        setUser('');
        navigate('/');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  };

  const handleMyNote = () => {
    navigate('/myNotePage');
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <h1 className="navbar-title">StudyShare</h1>
        </Link>

        <div className="navbuttons">
          <Link to="/">
            <button className="home-button">Home</button>
          </Link>
          {user ? (
            <button className='my-note-button' onClick={handleMyNote}>MyNotes</button>
          ) : (
            <></>
          )}
        </div>

        <div className="login">
          {user ? (
            <>
              <div className='profile-container'>
                <ProfileButton />
                <button onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <button>Login</button>
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  )
};

export default Layout;
