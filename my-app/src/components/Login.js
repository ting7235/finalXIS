import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  // Define state variables to store the email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Get the navigation function from react-router-dom
  const navigate = useNavigate();

  // Handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Login successful
        const data = await response.json();
        alert('Login successful');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);  
        localStorage.setItem('role', data.role); 
        navigate('/home'); 
      } else {
        // Login failed
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      // Handle any errors that occurred during the login process
      alert(`Error: ${error.message}`);
    }
  };

  // Handle the redirect to the registration page
  const handleRegisterRedirect = () => {
    navigate('/register'); 
  };

  // Render the login form
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-700">Don't have an account?</p>
        <button
          onClick={handleRegisterRedirect}
          className="text-blue-500 hover:underline"
        >
          Register here
        </button>
      </div>
    </div>
  );
};

export default Login;
