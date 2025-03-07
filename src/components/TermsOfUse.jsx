import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl p-8 shadow-xl text-gray-300">
        <Link to="/" className="text-green-500 hover:text-green-400 mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Use</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using ToonTie, you accept and agree to be bound by these Terms of Use and our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Spotify Account</h2>
            <p>To use ToonTie, you must:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Have a valid Spotify account</li>
              <li>Comply with Spotify's Terms of Service</li>
              <li>Grant ToonTie the necessary permissions to create playlists</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Guidelines</h2>
            <p>You agree not to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Use ToonTie for any unlawful purpose</li>
              <li>Attempt to circumvent any rate limits or restrictions</li>
              <li>Share your access credentials with others</li>
              <li>Reverse engineer or attempt to extract our source code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Intellectual Property</h2>
            <p>ToonTie respects intellectual property rights and expects users to do the same. All content provided through Spotify's API is subject to Spotify's terms and conditions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Disclaimer</h2>
            <p>ToonTie is provided "as is" without any warranties. We do not guarantee uninterrupted access to the service or the accuracy of recommendations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of ToonTie after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Spotify Terms</h2>
            <p>This application:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Is not endorsed or certified by Spotify</li>
              <li>Uses Spotify's APIs in compliance with their Developer Terms</li>
              <li>May be modified or terminated if required by Spotify's policies</li>
              <li>Respects Spotify's rate limits and usage guidelines</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse; 