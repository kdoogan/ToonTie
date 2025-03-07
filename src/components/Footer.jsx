import { Link } from 'react-router-dom';
import SpotifyAttribution from './SpotifyAttribution';

const Footer = () => {
  return (
    <footer className="py-6 px-4 mt-auto border-t border-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col items-center space-y-4">
          <SpotifyAttribution />
          
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link 
              to="/privacy" 
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="hover:text-white transition-colors"
            >
              Terms of Use
            </Link>
            <a 
              href="mailto:your-email@gmail.com"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
          
          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} ToonTie. Not affiliated with Spotify AB.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 