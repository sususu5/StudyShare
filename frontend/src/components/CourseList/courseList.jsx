import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './courseList.css';

function CourseList({ courses, selectedSchool }) {
  const navigate = useNavigate();

  const handleCourseClick = (courseCode) => {
    navigate(`/viewNotes/${courseCode}`);
  }

  return (
    <div className='course-list'>
      {courses.filter(course => course.school === selectedSchool).map((course, index) => (
        <button key={index} className='course-item' onClick={() => handleCourseClick(course.course_code)} >
          {course.course_code}
        </button>
      ))}
    </div>
  );
}

CourseList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      school: PropTypes.string.isRequired,
      course_code: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedSchool: PropTypes.string,
};

export default CourseList;