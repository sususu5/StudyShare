import { useEffect, useState } from 'react';
import CourseList from '../components/CourseList/courseList';
import RecentNotes from '../components/CurrentNotes/recentNotes';
import Sidebar from '../components/Sidebar/sidebar';
import './App.css';

function App() {
  const [user, setUser] = useState(null)
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const [courses, setCourses] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [ setFile] = useState(null);

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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // check file size limit 3MB
      if (selectedFile.size > 3 * 1024 * 1024) {
        alert('File size cannot exceed 3MB');
        return;
      }

      // file size is ok, start reading and converting to base64
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64String = e.target.result;
        console.log('Base64 file: ', base64String);
        
        // call upload API
        uploadNotes("user-token", "CS101", "Lecture", base64String, "Lecture Notes", "These are the notes for week 1");
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="app">
      <div className="upload-container">
        <h1>upload notes</h1>
        <input type="file" onChange={handleFileChange} accept=".pdf" />
        <button onClick={handleUpload}>Upload!</button>
      </div>

      <nav className="navbar">
        <h1>StudyNotes Share</h1>
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </nav>

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
            <button onClick={handleUpload}>Upload Note</button>
          </div>
          <h2>Recent Notes</h2>
          <RecentNotes notes={notes} handleUpvote={handleUpvote} />
          <CourseList courses={courses} selectedSchool={selectedSchool} />
        </main>
      </div>
    </div>
  )
}

// upload notes to backend
async function uploadNotes(token, courseCode, tag, base64File, title, description) {
  const noteData = {
    token,
    courseCode,
    tag,
    file: base64File, // base64
    title,
    description,
  };

  try {
    const response = await fetch('http://localhost:3000/api/saveNotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    console.log('Upload success:', result);
  } catch (error) {
    console.error('Upload error:', error);
  }
}

export default App
