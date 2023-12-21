import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ErrorsDisplay from "./ErrorsDisplay.js";
import { useUser } from "../context/UserContext.js";
import Forbidden from "./Forbidden.js";

const UpdateCourse = () => {
  const { authUser: user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
  });
  const [errors, setErrors] = useState([]);
  const [isUserAuthorized, setUserAuthorized] = useState(true); // Add state to track user authorization

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/courses/${id}`);
        const data = await response.json();

        if (response.status === 404) {
          navigate('/notfound');
        } else if (user.id !== data.userId) {
          // Set user authorization state to false if the user is not the owner
          setUserAuthorized(false);
        } else {
          setFormData(data);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourse();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5001/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${user.emailAddress}:${user.password}`)}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 204) {
        navigate(`/courses/${id}`);
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else if (response.status === 403) {
        navigate('/forbidden');
      } else {
        navigate('/error');
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/courses/${id}`);
  };

  return (
    <div className="bounds course--detail">
      {!isUserAuthorized ? ( // Conditionally render Forbidden component if user is not authorized
        <Forbidden />
      ) : (
        <>
          <h1>Update Course</h1>
          <ErrorsDisplay errors={errors} />
          <div>
            <form onSubmit={handleSubmit}>
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <div>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Course title..."
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <p>
                    By: {formData.User ? `${formData.User.firstName} ${formData.User.lastName}` : "Unknown User"}
                  </p>
                </div>
                <div className="course--description">
                  <div>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Course description..."
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <div>
                        <input
                          id="estimatedTime"
                          name="estimatedTime"
                          type="text"
                          placeholder="Hours"
                          value={formData.estimatedTime}
                          onChange={handleChange}
                        />
                      </div>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <div>
                        <textarea
                          id="materialsNeeded"
                          name="materialsNeeded"
                          placeholder="List materials..."
                          value={formData.materialsNeeded}
                          onChange={handleChange}
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">
                  Update Course
                </button>
                <button className="button button-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdateCourse;
