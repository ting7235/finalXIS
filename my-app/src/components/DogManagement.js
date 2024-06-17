import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DogManagement = () => {
  //defind some value to store
  const [dogs, setDogs] = useState([]);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  //get dog lists
  useEffect(() => {
    fetchDogs();
  }, []);

  //get dog lists by back-end 
  const fetchDogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:3001/api/dogs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDogs(response.data);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };

  //submit the from
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('breed', breed);
    formData.append('age', age);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      if (editMode) {
        //Update dog information
        await axios.put(`http://127.0.0.1:3001/api/dogs/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setEditMode(false);
        setEditId(null);
      } else {
        //add dog
        await axios.post('http://127.0.0.1:3001/api/dogs', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      fetchDogs();
      setName('');
      setBreed('');
      setAge('');
      setDescription('');
      setImage(null);
    } catch (error) {
      console.error('Error saving dog:', error);
    }
  };

  //Delete dog events
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:3001/api/dogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchDogs();
    } catch (error) {
      console.error('Error deleting dog:', error);
    }
  };

  //Edit dog events
  const handleEdit = (dog) => {
    setName(dog.name);
    setBreed(dog.breed);
    setAge(dog.age);
    setDescription(dog.description);
    setImage(dog.image);
    setEditMode(true);
    setEditId(dog.id);
  };

  //It includes the form for adding & editing dogs, as well as the grid layout displaying the list of dogs.
  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Manage Dogs</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Breed:</label>
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {editMode ? 'Update Dog' : 'Add Dog'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dogs.map((dog) => (
          <div key={dog.id} className="p-4 border rounded-lg shadow-md">
            <img src={`http://127.0.0.1:3001/api${dog.image}`} alt={dog.name} className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-bold">{dog.name}</h3>
            <p>{dog.breed}</p>
            <p>{dog.age} years old</p>
            <p>{dog.description}</p>
            <div className="mt-4">
              <button
                onClick={() => handleEdit(dog)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(dog.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DogManagement;
