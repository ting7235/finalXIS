import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Navbar from './components/Navbar';
import DogManagement from './components/DogManagement';
import MessageForm from './components/MessageForm';
import MessageManagement from './components/MessageManagement';
import Favorites from './components/Favorites';
import UserMessages from './components/UserMessages';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/home"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/manage-dogs"
            element={
              <>
                <Navbar />
                <DogManagement />
              </>
            }
          />


          <Route path="/send-message" element={
            <>
              <Navbar />

              <MessageForm />
            </>
          }
          />

          <Route path="/user-messages" element=
            {
              <>
                <Navbar />

                <UserMessages />
              </>
            }
          />
          <Route path="/manage-messages" element=
            {
              <>
                <Navbar />

                <MessageManagement />
              </>
            }
          />
          <Route path="/favorites" element={
            <>
              <Navbar />

              <Favorites />
            </>
          }
          />



        </Routes>
      </div>
    </Router>
  );
}

export default App;
