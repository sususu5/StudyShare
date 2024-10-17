import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import CourseList from './components/CourseList/courseList';
import RecentNotes from './components/CurrentNotes/recentNotes';
import ShowNoteJustUploaded from './components/ShowNoteJustUploaded/showNoteJustUploaded';
import Sidebar from './components/Sidebar/sidebar';
import UploadButton from './components/UploadButton/uploadButton';
import UploadNotePage from './components/UploadNotePage/uploadNotePage';
import ShowOneNote from './components/ShowOneNote/showOneNote';
import MyNoteButton from './components/MyNoteButton/myNoteButton';
function App() {
  const [user, setUser] = useState(null)
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const [courses, setCourses] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    fetchNotes();
    fetchCourses();
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

  const fetchCourses = async () => {
    const query = `query MyQuery {
      courses {
        course_code
        course_name
        school
      }
    }`;
    try {
      const response = await fetch('https://graphql.csesoc.app/v1/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setCourses(data.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
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
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>StudyNotes Share</h1>
          <div className="button-container">
            <MyNoteButton />
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
        <Routes>
          <Route path='/' element={
            <div className="main-content">
              <Sidebar courses={courses} onSchoolSelect={handleSchoolSelect} />
              <main className="content">
                <div className="search-upload">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <UploadButton />
                </div>
                <h2>Recent Notes</h2>
                <RecentNotes notes={notes} handleUpvote={handleUpvote} />
                <CourseList courses={courses} selectedSchool={selectedSchool} />
              </main>
            </div>}>
          </Route>
          <Route path="/uploadPage" element={<UploadNotePage />} />
          <Route path="/showNoteJustUploaded" element={<ShowNoteJustUploaded />} />
          <Route path="/showOneNote" element={<ShowOneNote />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
