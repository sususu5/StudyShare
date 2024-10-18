import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './recentNotes.css';

function RecentNotes({ notes }) {
  const navigate = useNavigate();

  return (
    <ul className="notes-list">
      {notes.map(note => (
        <li 
          key={note.noteId} 
          className="notes-item"
          onClick={() => navigate(`/showOneNote`, { state: { noteId: note.noteId } })}
        >
          <span className='note-title'>{note.title}</span>
          <span className='course-code'>{note.courseCode}</span>
          <span className='last-modified'>
            Last modified: {new Date(note.timeLastEdited * 1000).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
}

RecentNotes.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      noteId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      timeLastEdited: PropTypes.number.isRequired,
    })
  ),
  searchTerm: PropTypes.string,
};

export default RecentNotes;
