import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl p-8 shadow-xl text-gray-300">
        <Link to="/" className="text-green-500 hover:text-green-400 mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>When you use ToonTie, we access only the following data from your Spotify account:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Your Spotify profile information (display name, profile picture)</li>
              <li>Your top artists and tracks</li>
              <li>Playlists you create using our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your information solely to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Create personalized playlist recommendations</li>
              <li>Save playlists to your Spotify account</li>
              <li>Improve our recommendation algorithm</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Storage</h2>
            <p>ToonTie does not store any of your Spotify data permanently. We only use your data temporarily while you're using the application.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Spotify API for music data and playlist creation</li>
              <li>Last.fm API for artist recommendations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="mt-2">Email: your-email@gmail.com</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Spotify Data & Rights</h2>
            <p>All Spotify data is accessed through the official Spotify Web API. You have the right to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Revoke ToonTie's access to your Spotify account at any time</li>
              <li>Request deletion of playlists created through our service</li>
              <li>Control what data you share with our application</li>
            </ul>
            <p className="mt-2">For more information about how Spotify handles your data, please visit the <a href="https://www.spotify.com/privacy" className="text-green-500 hover:text-green-400">Spotify Privacy Policy</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 