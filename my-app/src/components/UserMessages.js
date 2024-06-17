import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserMessages = () => {
  // Define state variable to store the user's messages
  const [messages, setMessages] = useState([]);
  // Get the user's ID from localStorage
  const userId = localStorage.getItem('userId');

  // Fetch the user's messages when the component mounts
  useEffect(() => {
    fetchUserMessages();
  }, []);

  const fetchUserMessages = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the user's authentication token from localStorage
      const response = await axios.get(`http://127.0.0.1:3001/api/user/messages/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the authentication token in the request headers
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching user messages:', error);
    }
  };

  // Render the user's messages
  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Your Messages</h2>
      {messages.length === 0 ? (
        <p className="mt-4">You haven't sent any messages yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className="p-4 border rounded-lg shadow-md">
              <p><strong>Dog ID:</strong> {msg.dogId}</p>
              <p><strong>Message:</strong> {msg.message}</p>
              <p><strong>Response:</strong> {msg.response}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMessages;
