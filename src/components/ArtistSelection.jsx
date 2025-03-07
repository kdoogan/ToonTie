import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ArtistSelection = () => {
  const [topArtists, setTopArtists] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=50', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setTopArtists(data.items);
      } catch (error) {
        console.error('Error fetching top artists:', error);
      }
    };

    fetchTopArtists();
  }, [token]);

  const toggleArtist = (artist) => {
    setSelectedArtists(prev => 
      prev.find(a => a.id === artist.id)
        ? prev.filter(a => a.id !== artist.id)
        : [...prev, artist]
    );
  };

  const handleContinue = () => {
    if (selectedArtists.length > 0) {
      // Log the selected artists for debugging
      const artistIds = selectedArtists.map(artist => artist.id);
      console.log('Selected artist IDs:', artistIds);
      
      navigate('/playlist', {
        state: { 
          selectedArtists: selectedArtists.map(artist => ({
            id: artist.id,
            name: artist.name
          }))
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Select Your Favorite Artists</h1>
        <p className="text-gray-400 mb-6">Selected: {selectedArtists.length} artists</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topArtists.map(artist => (
            <button
              key={artist.id}
              onClick={() => toggleArtist(artist)}
              className={`p-4 rounded-xl transition-all transform hover:scale-105
                ${selectedArtists.find(a => a.id === artist.id)
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-800 text-gray-200'}`}
            >
              <div className="flex flex-col items-center">
                {artist.images?.[0] && (
                  <img 
                    src={artist.images[0].url} 
                    alt={artist.name}
                    className="w-24 h-24 rounded-full mb-3"
                  />
                )}
                <span className="font-medium text-center">{artist.name}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedArtists.length === 0}
          className="mt-8 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full 
            font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            fixed bottom-8 right-8"
        >
          Continue ({selectedArtists.length})
        </button>
      </div>
    </div>
  );
};

export default ArtistSelection; 