import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './courseList.css';

function CourseList({ courses, selectedSchool, searchTerm }) {
  const navigate = useNavigate();
  const filteredCourses = courses.filter(course => {
    if (!searchTerm.trim()) {
      return course.school === selectedSchool;
    }
    return (
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCourseClick = (courseCode) => {
    navigate(`/viewNotes/${courseCode}`);
  }

  return (
    <div className='course-list'>
      {filteredCourses.map((course, index) => (
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
  selectedSchool: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default CourseList;