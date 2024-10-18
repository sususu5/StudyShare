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
          <Link to="/">
            <button class="button">Home</button>
          </Link>
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