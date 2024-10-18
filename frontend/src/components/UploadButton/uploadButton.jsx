import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './uploadButton.css';

function UploadButton({ courses }) {
  const navigate = useNavigate();

  const handleUpload = () => {
    console.log('Upload clicked');
    navigate('/uploadPage', { state: { courses } });
  }

  return (<button className='upload-button' onClick={handleUpload}>Upload Note</button>);
}

UploadButton.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      course_code: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default UploadButton;

// import { Link } from 'react-router-dom';
// import './uploadButton.css';

// function UploadButton() {
//   return (
//     <Link to="/uploadPage" className="upload-button">
//       Upload Note
//     </Link>
//   );
// }

//export default UploadButton;