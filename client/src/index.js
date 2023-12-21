import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Route>
      <UserProvider>
        <App />
      </UserProvider>
    </Route>
  </React.StrictMode>
);
