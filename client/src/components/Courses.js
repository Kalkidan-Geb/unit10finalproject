import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// import { api } from '../utilities/apiHelper';

const Courses = () => {
  // State for storing the list of courses
  const [courses, setCourses] = useState([]);

  // const navigate = useNavigate()

  // Effect hook to fetch the list of courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="wrap main--grid">
      {courses.map((course) => (
        <div key={course.id} className="grid-33">
          <Link className="course--module course--link" to={`/courses/${course.id}`}>
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
          </Link>
        </div>
      ))}
      <div className="grid-33">
        <Link className="course--module course--add--module" to="/courses/create">
          <h3 className="course--add--title">New Course</h3>
        </Link>
      </div>
    </div>
  );
};

export default Courses;