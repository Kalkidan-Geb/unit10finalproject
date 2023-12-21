import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Header = () => {
  const location = useLocation();
  const {authUser} = useUser();

  return (
    <header>
            <div className="wrap header--flex">
                <h1 className="header--logo"><Link to="/">Courses</Link></h1>
                <nav>
                    { authUser ?
                    <>
                        <ul className="header--signedin">
                        <li>Welcome {authUser.firstName} {authUser.lastName}</li>
                        <li><Link to="/signout">Sign Out</Link></li>
                        </ul>
                    </>
                        :
                        <>
                         <ul className="header--signedout">
                        <li><Link to="/signup">Sign Up</Link></li>
                        <li><Link to="/signin" state={{from:location.pathname}}> Sign In</Link></li>
                        </ul>
                        </>

                    }
                   
                </nav>
            </div>
        </header>
  )
}
export default Header