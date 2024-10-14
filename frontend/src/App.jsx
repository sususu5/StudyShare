import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes')
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  const handleLogout = () => {
    setUser(null);
    // Add any additional logout logic here (e.g., clearing local storage, API calls)
  };

  const handleLogin = () => {
    // Add login logic here
    // For example: redirect to login page or open login modal
    console.log('Login clicked');
  };

  // Add this function
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleUpload = () => {
    // Add upload logic here
    console.log('Upload clicked');
  };

  const handleUpvote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/${noteId}/upvote`, { method: 'POST' });
      if (response.ok) {
        fetchNotes(); // Refresh notes after upvoting
      }
    } catch (error) {
      console.error('Error upvoting note:', error);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>StudyShare</h1>
        
        
        <h2>Home</h2>
        <h2>Browse Courses</h2>
        {user ? (
        <>
          <h2>My Notes</h2>
          </>
        ) : (
          <></>
        )}
        
        
        <div className="login">
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
        </div>
        
      </nav>

      <div className="main-content">
        <aside className="sidebar">
          <h2>Navigation</h2>
          <ul>
            <li>Home</li>
            <li>My Notes</li>
            <li>Browse Courses</li>
          </ul>
        </aside>

        <main className="content">
          <h2>Recent Notes</h2>
          <div className="search-upload">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button onClick={handleUpload}>Upload Note</button>
          </div>
          <ul className="notes-list">
            {notes
              .filter(note => note.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(note => (
                <li key={note.id} className="note-item">
                  <span>{note.title}</span>
                  <button onClick={() => handleUpvote(note.id)}>
                    Upvote ({note.upvotes})
                  </button>
                </li>
              ))}
          </ul>
        </main>
      </div>
    </div>
  )
}

export default App
