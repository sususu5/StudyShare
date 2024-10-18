import { useNavigate } from 'react-router-dom';
import './myNoteButton.css';

function MyNoteButton() {
  const navigate = useNavigate();

  const handleMyNote = () => {
    navigate('/myNotePage');
  }

  return (<button className='myNote-button' onClick={handleMyNote}>MyNote</button>);
}

export default MyNoteButton;