import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PlaylistGenerator = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    // Define the processTracks helper function
    const processTracks = (tracks, artist, selectedArtist, similarArtists) => {
      const validTracks = tracks
        .sort(() => Math.random() - 0.5)
        .slice(0, 1)
        .map(track => ({
          ...track,
          sourceArtist: selectedArtist.name,
          relatedArtistName: artist.name,
          matchScore: similarArtists.find(a => 
            a.name.toLowerCase() === artist.name.toLowerCase()
          )?.match || 0
        }));

      console.log(`Got ${validTracks.length} track from ${artist.name}`);
      return validTracks;
    };

    // Add delay helper to handle rate limiting
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const getRecommendations = async () => {
      try {
        console.log('Starting recommendation process with artists:', location.state?.selectedArtists);

        if (!location.state?.selectedArtists?.length) {
          setError('No artists selected');
          setIsLoading(false);
          return;
        }

        const LASTFM_API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
        console.log('Using Last.fm API key:', LASTFM_API_KEY ? 'Present' : 'Missing');

        // Process artists sequentially instead of in parallel to avoid rate limits
        const recommendedTracks = [];
        for (const selectedArtist of location.state.selectedArtists) {
          try {
            console.log(`Processing artist: ${selectedArtist.name}`);

            // Get similar artists from Last.fm
            const lastfmUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(selectedArtist.name)}&api_key=${LASTFM_API_KEY}&format=json&limit=5`;
            const lastfmResponse = await fetch(lastfmUrl);
            
            if (!lastfmResponse.ok) {
              throw new Error(`Last.fm API error: ${lastfmResponse.status}`);
            }

            const lastfmData = await lastfmResponse.json();
            const similarArtists = lastfmData?.similarartists?.artist || [];
            console.log(`Found ${similarArtists.length} similar artists for ${selectedArtist.name}`);

            // Search for artists on Spotify with delay between requests
            const spotifyArtists = [];
            for (const similarArtist of similarArtists.slice(0, 5)) {
              await delay(1000);
              try {
                const searchResponse = await fetch(
                  `https://api.spotify.com/v1/search?q=${encodeURIComponent(similarArtist.name)}&type=artist&limit=1`,
                  {
                    headers: { 'Authorization': `Bearer ${token}` }
                  }
                );
                
                if (searchResponse.ok) {
                  const searchData = await searchResponse.json();
                  if (searchData.artists.items[0]) {
                    spotifyArtists.push(searchData.artists.items[0]);
                  }
                }
              } catch (error) {
                console.warn(`Error searching for artist ${similarArtist.name}:`, error);
              }
            }

            // Get tracks for each artist with delay
            const artistTracks = await Promise.all(
              spotifyArtists.map(async (artist) => {
                try {
                  await delay(1000); // Keep the delay for rate limiting
                  
                  const tracksResponse = await fetch(
                    `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
                    {
                      headers: { 'Authorization': `Bearer ${token}` }
                    }
                  );

                  if (!tracksResponse.ok) {
                    throw new Error(`Failed to get tracks: ${tracksResponse.status}`);
                  }

                  const tracksData = await tracksResponse.json();
                  
                  if (!tracksData.tracks?.length) {
                    console.log(`No tracks found for ${artist.name}`);
                    return [];
                  }

                  const processedTracks = processTracks(tracksData.tracks, artist, selectedArtist, similarArtists);
                  console.log(`Processed ${processedTracks.length} tracks for ${artist.name}`);
                  return processedTracks;
                } catch (error) {
                  console.error(`Error getting tracks for ${artist.name}:`, error);
                  return [];
                }
              })
            );

            recommendedTracks.push(...artistTracks.flat());
          } catch (error) {
            console.error(`Error processing artist ${selectedArtist.name}:`, error);
          }
        }

        console.log(`Found ${recommendedTracks.length} total tracks before deduplication`);

        const uniqueTracks = [...new Map(recommendedTracks.map(track => [track.id, track])).values()]
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 20);

        console.log(`Final playlist has ${uniqueTracks.length} tracks`);
        setRecommendations(uniqueTracks);

        if (uniqueTracks.length === 0) {
          setError('No suitable tracks found. Please try different artists.');
        }
      } catch (error) {
        console.error('Error getting recommendations:', error);
        setError(`Failed to get recommendations: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    getRecommendations();
  }, [token, location.state]);

  const savePlaylist = async () => {
    if (!playlistName) return;
    setIsSaving(true);

    try {
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await userResponse.json();

      // Create playlist with detailed description
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userData.id}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: playlistName,
            description: `Curated playlist based on ${location.state.selectedArtists.map(a => a.name).join(', ')}. Created with ToonTie - Discover music through artist connections.`,
            public: false
          })
        }
      );
      const playlistData = await playlistResponse.json();

      // Add tracks with better error handling
      const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: recommendations.map(track => track.uri)
          })
        }
      );

      if (!addTracksResponse.ok) {
        throw new Error('Failed to add tracks to playlist');
      }

      // Success notification
      navigate('/dashboard', { 
        state: { 
          message: 'Playlist created successfully! Check your Spotify account.',
          playlistId: playlistData.id
        }
      });
    } catch (error) {
      console.error('Error saving playlist:', error);
      setError('Failed to create playlist. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add a debug section to the UI
  const renderDebugInfo = () => (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">Debug Information</h3>
      <div className="space-y-2 text-sm text-gray-400">
        <p>Selected Artists: {location.state?.selectedArtists?.length || 0}</p>
        <p>Recommendations Count: {recommendations.length}</p>
        <p>Loading State: {isLoading ? 'True' : 'False'}</p>
        <p>Has Token: {token ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 
        flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={() => navigate('/select-artists')}
            className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mb-4"/>
          <p className="text-gray-400">Generating your playlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Debug Section */}
          {renderDebugInfo()}

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Your Curated Playlist</h1>
            <p className="text-gray-400">Based on your selected artists</p>
          </div>

          {/* Tracks Section */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
              </svg>
              Selected Tracks ({recommendations.length})
            </h2>
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((track, index) => (
                  <div 
                    key={track.id}
                    className="flex items-center bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 
                      transition-colors group"
                  >
                    <span className="text-xl font-bold text-gray-500 w-8 text-center">
                      {index + 1}
                    </span>
                    {track.album?.images?.[2] && (
                      <img 
                        src={track.album.images[2].url}
                        alt={track.album.name} 
                        className="w-12 h-12 rounded-md mx-4"
                      />
                    )}
                    <div className="flex-grow min-w-0">
                      <p className="text-white font-medium truncate">{track.name}</p>
                      <div className="flex flex-col text-sm">
                        <p className="text-gray-400 truncate">
                          {track.artists.map(artist => artist.name).join(', ')}
                        </p>
                        <p className="text-green-500 text-xs">
                          {track.isFromOriginalArtist ? (
                            `Top track from ${track.sourceArtist}`
                          ) : (
                            `Similar to ${track.sourceArtist} • From ${track.relatedArtistName}`
                          )}
                        </p>
                      </div>
                    </div>
                    {track.external_urls?.spotify && (
                      <a 
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-green-500 hover:text-green-400 hover:bg-gray-600 
                          rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                No tracks found. Try selecting different artists.
              </div>
            )}
          </div>

          {/* Save Section */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Save Your Playlist</h3>
              <input
                type="text"
                placeholder="Enter playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 
                  focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none mb-4"
              />
              <button
                onClick={savePlaylist}
                disabled={!playlistName || isSaving}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 
                  rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"/>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"/>
                    </svg>
                    <span>Save to Spotify</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add footer */}
      <footer className="py-4 text-center text-gray-400 text-sm">
        <p>ToonTie helps you discover music through artist connections.</p>
        <div className="mt-2 space-x-4">
          <a 
            href="/privacy" 
            target="_blank"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="/terms" 
            target="_blank"
            className="hover:text-white transition-colors"
          >
            Terms of Use
          </a>
        </div>
      </footer>
    </div>
  );
};

export default PlaylistGenerator; 