import PropTypes from 'prop-types';
import './courseList.css';

function CourseList({ courses, selectedSchool }) {
  return (
    <ul className='courses-list'>
      {courses.filter(course => course.school === selectedSchool).map((course, index) => (
        <li key={index} className='course-item'>
          {course.course_code}
        </li>
      ))}
    </ul>
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