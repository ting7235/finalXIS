import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  //Define state variables to store dog lists, search keywords, filter breeds and favorites
  const [dogs, setDogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBreed, setFilterBreed] = useState('');
  const [favorites, setFavorites] = useState([]);
  const userId = localStorage.getItem('userId');  //Get userId from localStorage

  //Get the dog list and favorites when the component is mounted
  useEffect(() => {
    fetchDogs();
    fetchFavorites();
  }, []);

  //Get dog list from backend API
  const fetchDogs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3001/api/dogs');
      setDogs(response.data);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };

  //Get user favorites from backend API
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:3001/api/favorites/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(response.data.map(fav => fav.dogId));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  //search bar
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //drop-down box
  const handleFilterChange = (e) => {
    setFilterBreed(e.target.value);
  };

  //Add and remove favorite click events
  const handleFavoriteToggle = async (dog) => {
    try {
      const token = localStorage.getItem('token');
      if (favorites.includes(dog.id)) {
        await axios.delete('http://127.0.0.1:3001/api/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { userId, dogId: dog.id },
        });
      } else {
        await axios.post('http://127.0.0.1:3001/api/favorites', { userId, dogId: dog.id }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      fetchFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  //Filter dog list based on search keywords and filter breeds
  const filteredDogs = dogs.filter((dog) => {
    return (
      (dog.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       dog.breed.toLowerCase().includes(searchTerm.toLowerCase())) && 
      (filterBreed === '' || dog.breed.toLowerCase() === filterBreed.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Dogs List</h2>
      
      {/* search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or breed"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Breed Filter */}
      <div className="mb-4">
        <label className="block text-gray-700">Breed Filter:</label>
        <select
          value={filterBreed}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All breeds</option>
          {[...new Set(dogs.map(dog => dog.breed))].map((breed, index) => (
            <option key={index} value={breed}>{breed}</option>
          ))}
        </select>
      </div>

      {/* Dog lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDogs.map((dog) => (
          <div key={dog.id} className="p-4 border rounded-lg shadow-md">
            {/* <img src={`http://127.0.0.1:3001/api${dog.image}`} alt={dog.name} className="w-full h-48 object-cover mb-4" /> */}
            {/* image path */}
            <img src={`http://127.0.0.1:3001/api/${dog.image}`} alt={dog.name} className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-bold">{dog.name}</h3>
            <p>{dog.breed}</p>
            <p>{dog.age} years old</p>
            <p>{dog.description}</p>
            {/* add the button for favorite and remove */}
            <button
              onClick={() => handleFavoriteToggle(dog)}
              className={`mt-2 px-4 py-2 rounded-lg ${favorites.includes(dog.id) ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {favorites.includes(dog.id) ? 'Unfavorite' : 'Favorite'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
