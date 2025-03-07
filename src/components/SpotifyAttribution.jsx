import spotifyLogo from '../assets/spotify-logo.svg';

const SpotifyAttribution = () => {
  return (
    <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
      <span>Powered by</span>
      <img src={spotifyLogo} alt="Spotify Logo" className="h-6 w-6" />
      <a 
        href="https://spotify.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-spotify-green hover:text-green-400 transition-colors"
      >
        Spotify
      </a>
    </div>
  );
};

export default SpotifyAttribution; 