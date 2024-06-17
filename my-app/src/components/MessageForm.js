import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessageForm = () => {
  // Define state variables to store the list of dogs, selected dog ID, and message
  const [dogs, setDogs] = useState([]);
  const [dogId, setDogId] = useState('');
  const [message, setMessage] = useState('');

  // Fetch the list of dogs when the component mounts
  useEffect(() => {
    fetchDogs();
  }, []);

  // Fetch the list of dogs from the backend API
  const fetchDogs = async () => {
    const response = await axios.get('http://127.0.0.1:3001/api/dogs');
    setDogs(response.data);
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior
    const token = localStorage.getItem('token'); 

    const userId = localStorage.getItem('userId'); 
    try { // Send a POST request to the messages API endpoint with the user ID, selected dog ID, and message
      await axios.post('http://127.0.0.1:3001/api/messages', { userId, dogId, message },

       { headers: {
          Authorization: `Bearer ${token}`,
        },}
      );
      alert('Message sent successfully');
      setDogId('');
      setMessage('');
    } catch (error) {
      alert('Error sending message');
    }
  };

  // Render the message form
  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Please select a dog:</label>
          <select
            value={dogId}
            onChange={(e) => setDogId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a dog</option>
            {dogs.map((dog) => (
              <option key={dog.id} value={dog.id}>{dog.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
