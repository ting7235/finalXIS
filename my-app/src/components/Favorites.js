import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const userId = localStorage.getItem('userId');   //Get user ID from localStorage

  //get Favorites data
  useEffect(() => {
    fetchFavorites();
  }, []);

  //Get the current user's favorites from the backend API
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:3001/api/favorites/details/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  
  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">Favorite Dogs</h2>
      {/* If the favorites is empty, display a prompt message */}
      {favorites.length === 0 ? (      
        <p className="mt-4">You have no favorite dogs yet.</p>
      ) : (
        //then display favorites dog lists
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((dog) => (
            <div key={dog.id} className="p-4 border rounded-lg shadow-md">
              <img src={`http://127.0.0.1:3001/api/${dog.image}`} alt={dog.name} className="w-full h-48 object-cover mb-4" />
              <h3 className="text-xl font-bold">{dog.name}</h3>
              <p>{dog.breed}</p>
              <p>{dog.age} years old</p>
              <p>{dog.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
