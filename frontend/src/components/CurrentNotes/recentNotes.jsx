import PropTypes from 'prop-types';
import './recentNotes.css';

function RecentNotes({ notes }) {
  return (
    <ul className="notes-list">
      {notes.map(note => (
        <li key={note.noteId} className="notes-item">
          <span>{note.title}</span>
          <span className='last-modified'>Last modified: {new Date(note.timeLastEdited).toLocaleDateString()}</span>
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
      timeLastEdited: PropTypes.string.isRequired,
    })
  ),
  searchTerm: PropTypes.string,
};

export default RecentNotes;