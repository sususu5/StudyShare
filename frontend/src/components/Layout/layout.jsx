import { useState } from 'react';
import { Link, Outlet } from "react-router-dom";
import MyNoteButton from '../MyNoteButton/myNoteButton';
import './layout.css';

function Layout() {
  const [user] = useState(null);
  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <h1 className="navbar-title">StudyShare</h1>
        </Link>

        <div className="navbuttons">
          <Link to="/">
            <button className="button">Home</button>
          </Link>
          <MyNoteButton />
          {/* {user ? (
            <>
              <MyNoteButton />
            </>
          ) : (
            <></>
          )} */}
        </div>

        <div className="login">
          {user ? (
            <>
              <button>Logout</button>
            </>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  )
};

export default Layout;