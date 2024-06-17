import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  // Get the user's role from localStorage
  const role = localStorage.getItem('role');

  // Get the navigation function from react-router-dom
  const navigate = useNavigate();

  // Handle the logout button click
  const handleLogout = () => {
    // Remove the user's token, role, and user ID from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Render the navigation bar
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">DOG APP</h1>
        <div>
          <Link to="/home" className="text-white mr-4">Home</Link>
          <Link to="/send-message" className="text-white mr-4">SendMessage</Link>
          <Link to="/user-messages" className="text-white mr-4">UserMessages</Link>
          {role === 'staff' && (
            <>
              <Link to="/manage-messages" className="text-white mr-4">Manage Messages</Link>
              <Link to="/manage-dogs" className="text-white mr-4">Manage Dogs</Link>
            </>
          )}
          <Link to="/favorites" className="text-white mr-4">Favorites</Link>
          <button onClick={handleLogout} className="text-white">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
