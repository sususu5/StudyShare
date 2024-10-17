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
  }, []);

  const handleUpvote = async (noteId) => {
    setUpvotedNotes(prevState => ({
      ...prevState,
      [noteId]: !prevState[noteId],
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="top-bar">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        <header className="notes-header">Notes for {courseCode}</header>
      </div>
      <div className='notes-container'>
        {notes.map(note => (
          <div key={note.noteId} className='note-item'>
            <h3 className='note-title'>{note.title}</h3>
            <button onClick={() => handleUpvote(note.noteId)} className='upvote-button'>
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