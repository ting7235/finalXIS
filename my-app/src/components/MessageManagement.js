import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessageManagement = () => {
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token'); //Get the user's authentication token from localStorage
      const response = await axios.get('http://127.0.0.1:3001/api/messages', {
        headers: {
          Authorization: `Bearer ${token}`, //Include the authentication token in the request headers
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Error fetching messages');
    }
  };

  // Handle the response input field change
  const handleResponseChange = (e) => {
    setResponse(e.target.value);
  };

  // Handle the send response button click
  const handleSendResponse = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://127.0.0.1:3001/api/messages/${id}`, //Send a PUT request to the message API endpoint with the message ID
        { response },  // Include the response text in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Response sent successfully');
      setResponse(''); // Reset the response input field
      fetchMessages(); // Refresh the list of messages
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Error sending response');
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:3001/api/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Message deleted successfully');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  // Render the message management interface
  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Manage Messages</h2>
      <div className="grid grid-cols-1 gap-6">
        {messages.map((msg) => (
          <div key={msg.id} className="p-4 border rounded-lg shadow-md">
            <p><strong>Dog ID:</strong> {msg.dogId}</p>
            <p><strong>Message:</strong> {msg.message}</p>
            <p><strong>Response:</strong> {msg.response}</p>
            <div className="mt-4">
              <textarea
                value={response}
                onChange={handleResponseChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                placeholder="Write a response..."
              />
              {/* Send response button */}
              <button
                onClick={() => handleSendResponse(msg.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2"
              >
                Send Response
              </button>
              {/* Delete message button */}
              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                Delete Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageManagement;
