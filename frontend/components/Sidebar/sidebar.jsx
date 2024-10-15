import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "./sidebar.css";

async function fetchGraphQL(query, variables) {
  const result = await fetch('https://graphql.csesoc.app/v1/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  return await result.json();
}

const query = `query MyQuery {
  courses {
    course_code
    course_name
  }
}
`

function Sidebar() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getCourses = async () => {
      try {
        const { data, errors } = await fetchGraphQL(query, { capacity: 100 });

        if (errors) {
          console.error('Error fetching courses:', errors);
          return;
        }

        console.log(data);
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    getCourses();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Courses</h2>
      <input type="text" placeholder="Search courses..." value={searchTerm} onChange={handleSearchChange} className="sidebar-searchbar" />
      <div className="course-list">
        {courses.filter((course) => course.course_code.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((course, index) => (
            <div key={index} className="course-item">
              {course.course_code}
            </div>
          ))}
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Sidebar;