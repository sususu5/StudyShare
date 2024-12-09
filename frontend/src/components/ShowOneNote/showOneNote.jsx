import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useHistory
import './showOneNote.css'; // Import the CSS for styling
import { ArrowBack } from '@mui/icons-material';

function ShowOneNote() {
  const location = useLocation();
  const [pdfUrl, setPdfUrl] = useState('');
  const [noteDetails, setNoteDetails] = useState(null); // State to hold note details
  const [upvoted, setUpvoted] = useState(false); // State to track upvote status
  const navigate = useNavigate();
  useEffect(() => {
    const fetchNoteData = async () => {
      const noteId = location.state.noteId;
      console.log("noteId: ", noteId);
      try {
        const response = await fetch('http://localhost:5000/api/data');
        if (!response.ok) {
          console.error('Failed to fetch data');
          return;
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Response is not JSON');
          return;
        }
        const result = await response.json();
        console.log("result ", result);
        const note = result.notes.find(n => n.noteId === noteId);
        if (!note) {
          console.error('Note not found');
          return;
        }
        const uploadedFileUrl = 'http://localhost:5000/' + note.filePath;
        if (uploadedFileUrl) {
          setPdfUrl(uploadedFileUrl);
        }
        setNoteDetails(note); // Set the note details
        setUpvoted(note.upvoted); // Set initial upvote status
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchNoteData();
  }, [location.state.noteId]);

  const handleUpvote = async () => {
    try {
      const token = localStorage.getItem('authToken');
      // if user is not found warn the user by alert
      if (!token) {
        alert('You need to login to upvote a note');
        return;
      }
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
      const user = data.users.find(u => u.token.includes(token));
      const userId = user.userId;
      const response = await fetch(`http://localhost:5000/api/upvoteNote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId: noteDetails.noteId, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to upvote note');
      }

      const result = await response.json();
      console.log(result.message);

      // Update the upvote status and counter
      setUpvoted(!upvoted);
      setNoteDetails(prevDetails => ({
        ...prevDetails,
        upvoteCounter: result.updatedUpvoteCounter ?? prevDetails.upvoteCounter
      }));
      const fetchNoteData = async () => {
        const noteId = location.state.noteId;
        console.log("noteId: ", noteId);
        try {
          const response = await fetch('http://localhost:5000/api/data');
          if (!response.ok) {
            console.error('Failed to fetch data');
            return;
          }
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.error('Response is not JSON');
            return;
          }
          const result = await response.json();
          console.log("result ", result);
          const note = result.notes.find(n => n.noteId === noteId);
          if (!note) {
            console.error('Note not found');
            return;
          }
          const uploadedFileUrl = 'http://localhost:5000/' + note.filePath;
          if (uploadedFileUrl) {
            setPdfUrl(uploadedFileUrl);
          }
          setNoteDetails(note); // Set the note details
          setUpvoted(note.upvoted); // Set initial upvote status
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchNoteData();
    } catch (error) {
      console.error('Error upvoting note:', error);
    }
  };

  return (
    <div className="show-one-note">
      <div className="top-bar">
        <ArrowBack 
          onClick={() => navigate(-1)} 
          className="arrow-back-icon" 
        />
      </div>
      {noteDetails && (
        <div className="note-details">
          <h2>{noteDetails.title}</h2>
          <p>Description: {noteDetails.description}</p>
          <p>Course: {noteDetails.courseCode}</p>
          <p>Tag: {noteDetails.tag}</p>
          <button className="download-button" onClick={() => window.open(pdfUrl, '_blank')}>Download Note</button>
          <button onClick={handleUpvote} className={`upvote-button ${upvoted ? 'upvoted' : ''}`}>
            <img src="/src/assets/upvote.svg" 
                 alt="upvoteIcon" 
                 className={`upvote-icon ${upvoted ? 'upvoted' : ''}`} 
            />
            <p className={`note-upvotes ${upvoted ? 'upvoted' : ''}`}>{noteDetails.upvoteCounter}</p>
          </button>
        </div>
      )}
      {pdfUrl ? (
        <div className="pdf-viewer">
          <iframe src={pdfUrl} width="80%" height="600px" title="PDF Viewer" className="pdf-viewer"></iframe>
        </div>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
}

export default ShowOneNote;
