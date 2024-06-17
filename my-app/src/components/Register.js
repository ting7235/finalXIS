import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  // Define state variables to store the email, password, and employee code
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeCode, setEmployeeCode] = useState(''); 
  const navigate = useNavigate();  // Get the navigation function from react-router-dom

  // Handle the redirect to the login page
  const handleRegisterRedirect = () => {
    navigate('/login'); 
  };
  
  // Determine the user's role based on the employee code
  const handleRegister = async (e) => {
    e.preventDefault();
    const role = employeeCode === '30218' ? 'staff' : 'user';

    try {
      // Send a POST request to the registration API endpoint
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (response.ok) {
        // Registration successful
        const data = await response.json();
        alert('Registration successful');
      } else {
        // Registration failed
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.error}`);
      }
    } catch (error) {
      // Handle any errors that occurred during the registration process
      alert(`Error: ${error.message}`);
    }
  };

  // Render the registration form
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleRegister}>
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
        <div className="mb-4">
          <label className="block text-gray-700">Employee Code:</label>
          <input
            type="text"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Register button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Register
        </button>
        {/* Login redirect link */}
        <div className="mt-4 text-center">
          <p className="text-gray-700">Have an account?</p>
          <button
            onClick={handleRegisterRedirect}
            className="text-blue-500 hover:underline"
          >
            Login here
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
