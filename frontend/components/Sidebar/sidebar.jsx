import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "./sidebar.css";

function Sidebar({ courses, onSchoolSelect }) {
  const [uniqueSchools, setUniqueSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    const schools = [... new Set(courses.map(course => course.school))];
    setUniqueSchools(schools);
  }, [courses]);

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    onSchoolSelect(school);
  }

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Courses</h2>
      <div className="school-list">
        {uniqueSchools.map((school, index) => (
          <button
            key={index}
            className="school-item"
            onClick={() => handleSchoolSelect(school)}
            style={{
              backgroundColor: selectedSchool === school ? '#646cff' : '#bee7e9',
              color: selectedSchool === school ? "white" : "black",
            }}>
            {school}
          </button>
        ))}
      </div>
    </aside >
  );
}

Sidebar.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      school: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSchoolSelect: PropTypes.func.isRequired,
};

export default Sidebar;