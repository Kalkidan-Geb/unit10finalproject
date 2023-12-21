import './App.css';
import './styles/reset.css'
import './styles/global.css'
import {
  Route, Routes
} from 'react-router-dom'
import Header from './components/Header';
import Courses from './components/Courses'
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse'
import CourseDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn'
import UserSignOut from './components/UserSignOut';
import UserSignUp from './components/UserSignUp';
import PrivateRoute from './components/PrivateRoute';






function App() {

// Route components 
  return ( 
<>
<Header/>
<Routes>
  <Route path='/' element={<Courses/>}/>
  <Route element={<PrivateRoute/>}>
    <Route path='/courses/create' element={<CreateCourse/>}/>
    <Route path='courses/:id/update' element={<UpdateCourse/>}/>
  </Route>
  <Route path='courses/:id' element={<CourseDetail/>}/>
  <Route path='/signin' element={<UserSignIn/>}/>
  <Route path='signup' element={<UserSignUp/>}/>
  <Route path='/signout' element={<UserSignOut/>}/>
</Routes>
</>

        );
      }
export default App;
  