import { Outlet,  Link } from "react-router-dom";
import { useState } from 'react'
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
            <h2>My Notes</h2>
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