import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SpotifyLogo from '../assets/spotify-logo.svg';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  
  const CLIENT_ID = import.meta.env.SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = "user-top-read playlist-modify-public playlist-modify-private";

  useEffect(() => {
    const handleToken = async () => {
      const hash = window.location.hash;
      if (hash && !token) {
        const tokenFragment = hash
          .substring(1)
          .split("&")
          .find(elem => elem.startsWith("access_token"));
        
        if (tokenFragment) {
          const accessToken = tokenFragment.split("=")[1];
          const loginSuccess = await login(accessToken);
          
          if (loginSuccess) {
            // Clear the hash from the URL
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate('/dashboard', { replace: true });
          } else {
            // Handle failed login
            console.error('Login failed - invalid token');
            // Optionally show an error message to the user
          }
        }
      } else if (token) {
        navigate('/dashboard', { replace: true });
      }
    };

    handleToken();
  }, [token, navigate, login]);

  const handleLogin = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 
      flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <img src={SpotifyLogo} alt="Spotify Logo" className="w-12 h-12 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-8">ToonTie</h1>
        <button
          onClick={handleLogin}
          className="bg-spotify-green hover:bg-green-600 text-white font-bold py-3 px-8 
            rounded-full transition-colors flex items-center space-x-2"
        >
          <span>Login with Spotify</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage; 