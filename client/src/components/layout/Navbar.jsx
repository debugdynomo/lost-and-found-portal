import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span className="text-xl font-bold text-blue-600">Lost & Found</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:items-center sm:space-x-6">
              <Link to="/items" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors">Browse Items</Link>
              {user && (
                <Link to="/items/new" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors">Report Item</Link>
              )}
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors">Dashboard</Link>
                <span className="text-sm text-gray-500">Hi, {user.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-600 text-sm font-medium transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Register</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/items" onClick={() => setIsMenuOpen(false)} className="block pl-4 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Browse Items</Link>
            {user ? (
              <>
                <Link to="/items/new" onClick={() => setIsMenuOpen(false)} className="block pl-4 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Report Item</Link>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block pl-4 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left pl-4 pr-4 py-2 text-base font-medium text-red-600 hover:bg-gray-50">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block pl-4 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block pl-4 pr-4 py-2 text-base font-medium text-blue-600 hover:bg-gray-50">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
