import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../utilities/apiHelper';
import { useUser } from '../context/UserContext';

function CourseDetail() {
  const { authUser: user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();

  // State for storing course details and validation errors
  const [course, setCourse] = useState({});

  // Effect hook to fetch the course details on component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api(`/courses/${id}`, 'GET');
        const json = await res.json();
        if (res.status === 200) {
          setCourse(json);
        } else if (res.status === 404) {
          navigate('/notfound');
        } else {
          throw new Error();
        }
      } catch (error) {
        console.log("Error fetching and parsing the data", error);
        navigate('/error');
      }
    };
    fetchCourse();
  }, [id, navigate]);

  // Function to handle course deletion
  const handleDelete = async () => {
    try {
      console.log('Deleting course...');
      const response = await fetch(`http://localhost:5001/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${user.emailAddress}:${user.password}`)}`,
        },
      });

      if (response.status === 204) {
        console.log('Course deleted successfully');
        // Redirect to the home page or another appropriate page after deletion
        navigate('/');
      } else if (response.status === 403) {
        console.log('User not authorized to delete the course');
        // Handle forbidden access if needed
      } else {
        console.log('Unexpected error occurred while deleting course');
        // Handle other status codes if needed
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div>
      <div className="actions--bar">
        <div className="bounds">
          <div className="grid-100">
            <span>
              <Link className="button" to={`/courses/${id}/update`}>
                Update Course
              </Link>
              <button className="button" onClick={handleDelete}>
                Delete Course
              </button>
            </span>
            <Link className="button button-secondary" to="/">
              Return to List
            </Link>
          </div>
        </div>
      </div>
      <div className="bounds course--detail">
        <div className="grid-66">
          <div className="course--header">
            <h2 className="course--title-purple">{course.title}</h2>
            <p className="course--author">
              By {course.User ? `${course.User.firstName} ${course.User.lastName}` : 'Unknown User'}
            </p>
            <h4 className="course--label">Course Details</h4>
            <div className="course--description">
              <ReactMarkdown>{course.description}</ReactMarkdown>
            </div>
          </div>
        </div>
        <div className="grid-25 grid-right">
          <div className="course--stats">
            <ul className="course--stats--list">
              <li className="course--stats--list--item">
                <h3>Estimated Time</h3>
                <hr className="course--line" />
                <p className="course--time">{course.estimatedTime || 'N/A'}</p>
              </li>
              <li className="course--stats--list--item">
                <h4>Materials Needed</h4>
                <hr className="course--line" />
                <ul className="course--materials">
                  {course.materialsNeeded
                    ? course.materialsNeeded.split('\n').map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                    : 'N/A'}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;








