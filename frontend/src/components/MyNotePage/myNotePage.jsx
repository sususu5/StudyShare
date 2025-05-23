import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './myNotePage.css';
import { ArrowBack } from '@mui/icons-material';

function MyNotePage() {
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upvotedNotes, setUpvotedNotes] = useState({});
  console.log("userId: ", userId); // just for removing warning
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/viewNotes`);
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await response.json();
        const userId = data.users.find(user => user.token.includes(token))?.userId;
        setUserId(userId);
        const filteredNotes = data.notes.filter(note => note.userId === userId);
        setNotes(filteredNotes);
        
        const user = data.users.find(user => user.userId === userId);
        const username = user ? user.username : 'Unknown User';
        setUsername(username);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [token, setUserId]);

  const handleUpvote = async (noteId) => {
    try {
      // TODO: This should work after login
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
      console.log(result.message);

      setUpvotedNotes(prevState => ({
        ...prevState,
        [noteId]: !prevState[noteId],
      }));

      const fetchNotes = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/viewNotes`);
          if (!response.ok) {
            throw new Error('Failed to fetch notes');
          }
          const data = await response.json();
          const filteredNotes = data.notes.filter(note => note.userId === userId);
          setNotes(filteredNotes);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
      fetchNotes();
    } catch (error) {
      console.error('Error upvoting note:', error);
    }
  };

  const handleDelete = async (noteId) => {
    const userConfirmed = window.confirm("Are you sure you want to delete this note?");
    if (!userConfirmed) {
      return; // Exit if the user cancels the confirmation dialog
    }

    try {
      const response = await fetch(`http://localhost:5000/api/deleteNote`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      const result = await response.json();
      console.log(result.message);

      // Refresh notes after deletion
      const fetchNotes = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/viewNotes`);
          if (!response.ok) {
            throw new Error('Failed to fetch notes');
          }
          const data = await response.json();
          const filteredNotes = data.notes.filter(note => note.userId === userId);
          setNotes(filteredNotes);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="top-bar">
        <ArrowBack className="back-button" onClick={() => navigate(-1)} />
        <header className="notes-header">Notes for {username}</header>
      </div>
      <div className='notes-container'>
        {notes.map(note => (
          <div key={note.noteId} className='note-item' onClick={() => navigate('/showOneNote', { state: { noteId: note.noteId } })}>
            <h3 className='note-title'>{note.title}</h3>
            <button onClick={(e) => { e.stopPropagation(); handleUpvote(note.noteId); }} className='upvote-button'>
              <img src="/src/assets/upvote.svg" alt="upvoteIcon" className={`upvote-icon ${upvotedNotes[note.noteId] ? 'upvoted' : ''}`} />
              <p className={`note-upvotes ${upvotedNotes[note.noteId] ? 'upvoted' : ''}`}>{note.upvoteCounter}</p>
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(note.noteId); }} className='delete-button'>
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export default MyNotePage
