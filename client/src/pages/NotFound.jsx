import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-8xl font-extrabold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
