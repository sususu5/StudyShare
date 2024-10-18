import { Outlet,  Link } from "react-router-dom";
import { useState } from 'react'
import MyNoteButton from './components/MyNoteButton/myNoteButton';
import './layout.css'

function Layout() {
  const [user] = useState(null);
  return (
    <>
      <nav className="navbar">
        <h1>StudyShare</h1>

        <div className="navbuttons">
          <a href="/">
            <button className="button">Home</button>
          </a>
          {user ? (
          <>
            <MyNoteButton />
            </>
          ) : (
            <></>
          )}
        </div>
        
        <div className="login">
          {user ? (
            <>
              <button>Logout</button>
            </>
          ) : (
            <a href="/login">
              <button>Login</button>
            </a>
          )}
        </div>  
      </nav>
      <Outlet />
    </>
  )
};
export default Layout;