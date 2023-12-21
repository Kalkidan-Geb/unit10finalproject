import {  useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useUser } from '../context/UserContext'; // Import useUser, not UserContext
import ErrorsDisplay from './ErrorsDisplay';

function UserSignIn() {
  // State for handling validation errors
  const [errors, setErrors] = useState([]);

  // Accessing user context and location using useUser
  const { signIn } = useUser();
  const location = useLocation();

  // Refs for form input fields
  const emailAddress = useRef(null);
  const password = useRef(null);

  // Hook for navigation
  const navigate = useNavigate();

  // Event handler for form submission
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      // Attempt to sign in
      const user = await signIn({
        emailAddress: emailAddress.current.value,
        password: password.current.value,
      });

      // Determine where to navigate based on the location state
      let from = '/';
      if (location.state) {
        from = location.state.from;
      }

      // If sign in is successful, navigate to the specified location
      if (user) {
        navigate(from);
      } else {
        // If sign in fails, set validation errors
        setErrors(['Login failed']);
      }
    } catch (error) {
      // Handle unexpected errors
      navigate('/error');
    }
  };

  // Event handler for cancel button
  const handleCancel = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <div className="form--centered">
      <h2> Sign In</h2>

        <ErrorsDisplay errors={errors} />
      

      <form onSubmit={handleSubmit}>
        <label htmlFor="emailAddress">Email Address</label>
        <input id="emailAddress" name="emailAddress" type="email" ref={emailAddress} />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" ref={password} />
        <button className="button" type="submit">
          Sign In
        </button>
        <button className="button button-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </form>
      <p>
        Don't have a user account? Click here to <Link to="/signup">sign up</Link>!
      </p>
    </div>
  );
}

export default UserSignIn;
