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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
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
            <button className='my-note-button' onClick={handleMyNote}>MyNote</button>
          ) : (
            <></>
          )}
        </div>

        <div className="login">
          {user ? (
            <>
              <ProfileButton />
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <ProfileButton />
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
