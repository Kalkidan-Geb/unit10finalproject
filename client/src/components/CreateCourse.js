import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '../context/UserContext';
import ErrorsDisplay from './ErrorsDisplay';

function CreateCourse() {
  const { authUser: user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    userId: user.id
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${user.emailAddress}:${user.password}`)}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        navigate('/');
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else {
        navigate('/error');
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div>
      
      <main>
        <div className="wrap">
          <h2>Create Course</h2>
          <ErrorsDisplay errors={errors} />
          <form>
            <div className="main--flex">
              <div>
                <label htmlFor="courseTitle">Course Title</label>
                <input
                  id="courseTitle"
                  name="title"
                  type="text"
                  placeholder="Course title..."
                  value={formData.title}
                  onChange={handleChange}
                />

                <p>By {user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}</p>

                <label htmlFor="courseDescription">Course Description</label>
                <textarea
                  id="courseDescription"
                  name="description"
                  placeholder="Course description..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="estimatedTime">Estimated Time</label>
                <input
                  id="estimatedTime"
                  name="estimatedTime"
                  type="text"
                  placeholder="Hours"
                  value={formData.estimatedTime}
                  onChange={handleChange}
                />

                <label htmlFor="materialsNeeded">Materials Needed</label>
                <textarea
                  id="materialsNeeded"
                  name="materialsNeeded"
                  placeholder="List materials..."
                  value={formData.materialsNeeded}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid-100 pad-bottom">
              <button className="button" type="submit" onClick={handleSubmit}>
                Create Course
              </button>
              <button className="button button-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateCourse;
