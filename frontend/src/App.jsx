import { useEffect, useState } from 'react';
import './App.css';
import CourseList from './components/CourseList/courseList';
import RecentNotes from './components/CurrentNotes/recentNotes';
import Sidebar from './components/Sidebar/sidebar';
import UploadButton from './components/UploadButton/uploadButton';


function App() {
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

  // Add this function
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="app">
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
            <UploadButton courses={courses} />
          </div>
          <h2>Recent Notes</h2>
          <RecentNotes notes={notes} />
          {selectedSchool && <CourseList courses={courses} selectedSchool={selectedSchool} searchTerm={searchTerm} />}
        </main>
      </div>
    </div>
  )
}

export default App
