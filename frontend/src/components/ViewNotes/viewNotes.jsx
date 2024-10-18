import { ArrowBack } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import './viewNotes.css';

function ViewNotes() {
  const { courseCode } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upvotedNotes, setUpvotedNotes] = useState({});

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/viewNotes`);
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await response.json();
        const filteredNotes = data.notes.filter(note => note.courseCode === courseCode);
        setNotes(filteredNotes);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [courseCode]); // Add courseCode to the dependency array

  const handleUpvote = async (noteId) => {
    try {
      const token = localStorage.getItem('authToken');// TODO: This should work after login
      const dataResponse = await fetch('http://localhost:5000/api/data');
      if (!dataResponse.ok) {
        console.error('Failed to fetch data');
        return;
      }
      const contentType = dataResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON');
        return;
      }
      const data = await dataResponse.json();
      console.log("result ", data);
      const user = data.users.find(u => u.token.includes(token));
      const userId = user.userId;
      const response = await fetch(`http://localhost:5000/api/upvoteNote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to upvote note');
      }

      const result = await response.json();
      console.log(result.message); // Log success message

      // Optionally update the UI based on the response
      setUpvotedNotes(prevState => ({
        ...prevState,
        [noteId]: !prevState[noteId],
      }));

      // Refresh notes to reflect the updated upvote count
      const fetchNotes = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/viewNotes`);
          if (!response.ok) {
            throw new Error('Failed to fetch notes');
          }
          const data = await response.json();
          const filteredNotes = data.notes.filter(note => note.courseCode === courseCode);
          setNotes(filteredNotes);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
      fetchNotes(); // Call fetchNotes to refresh the notes
    } catch (error) {
      console.error('Error upvoting note:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="top-bar">
        <ArrowBack className="back-button" onClick={() => navigate(-1)} />
        <header className="notes-header">Notes for {courseCode}</header>
      </div>
      <div className='notes-container'>
        {notes.map(note => (
          <div key={note.noteId} className='note-item' onClick={() => navigate('/showOneNote', { state: { noteId: note.noteId } })}>
            <h3 className='note-title'>{note.title}</h3>
            <button onClick={(e) => { e.stopPropagation(); handleUpvote(note.noteId); }} className='upvote-button'>
              <img src="/src/assets/upvote.svg" alt="upvoteIcon" className={`upvote-icon ${upvotedNotes[note.noteId] ? 'upvoted' : ''}`} />
              <p className={`note-upvotes ${upvotedNotes[note.noteId] ? 'upvoted' : ''}`}>{note.upvoteCounter}</p>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default ViewNotes;
