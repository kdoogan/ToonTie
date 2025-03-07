import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileRes, tracksRes] = await Promise.all([
          fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const profileData = await profileRes.json();
        const tracksData = await tracksRes.json();

        setProfile(profileData);
        setTopTracks(tracksData.items);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.status === 401) logout();
      }
    };

    fetchUserData();
  }, [token, logout]);

  const handleStartPlaylistCreation = () => {
    navigate('/select-artists');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-500">ToonTie</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-200 bg-gray-700 rounded-full 
                hover:bg-gray-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar Layout */}
      <div className="flex-1 pt-20"> {/* Add padding-top to account for fixed nav */}
        <div className="container mx-auto px-4 py-8">
          {profile ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="w-full lg:w-1/4 space-y-8">
                {/* Profile Card */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex flex-col items-center">
                    {profile.images?.[0] && (
                      <img 
                        src={profile.images[0].url} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full border-4 border-green-500 mb-4"
                      />
                    )}
                    <h2 className="text-xl font-bold text-white mb-2">{profile.display_name}</h2>
                    <p className="text-gray-400 mb-4">{profile.followers.total} followers</p>
                    <a 
                      href={profile.external_urls?.spotify} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-400 transition-colors flex items-center"
                    >
                      View Profile
                      <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <button
                    onClick={handleStartPlaylistCreation}
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-3
                      flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                    </svg>
                    Create Playlist
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 lg:w-3/4">
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                    </svg>
                    Your Top Tracks
                  </h2>
                  <div className="space-y-4">
                    {topTracks.map((track, index) => (
                      <div 
                        key={track.id}
                        className="flex items-center bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 
                          transition-colors"
                      >
                        <span className="text-2xl font-bold text-gray-500 w-12 text-center">
                          {index + 1}
                        </span>
                        <img 
                          src={track.album.images[2].url} 
                          alt={track.album.name} 
                          className="w-16 h-16 rounded-lg mx-4"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{track.name}</p>
                          <p className="text-gray-400 text-sm truncate">
                            {track.artists.map(artist => artist.name).join(', ')}
                          </p>
                        </div>
                        <a 
                          href={track.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-500 hover:text-green-400 hover:bg-gray-600 
                            rounded-full transition-colors"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">


                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard