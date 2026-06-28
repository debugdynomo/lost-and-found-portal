import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ItemCard from '../../components/items/ItemCard';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const res = await api.get('/items?limit=6');
        setItems(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Find what you lost,<br />
          <span className="text-blue-600">Return what you found.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          The central hub for our campus lost and found. Help your peers reunite with their belongings quickly and easily.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/items/new?type=lost" className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-200 transition-all transform hover:-translate-y-1">
            I Lost Something
          </Link>
          <Link to="/items/new?type=found" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1">
            I Found Something
          </Link>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Recently Reported</h2>
            <p className="text-gray-600 mt-2">Latest items reported by the community</p>
          </div>
          <Link to="/items" className="text-blue-600 hover:text-blue-800 font-medium hidden sm:block">
            View All Items &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-sm border border-gray-100 h-[400px] animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(item => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No items reported yet</h3>
            <p className="text-gray-500">Be the first to report a lost or found item.</p>
          </div>
        )}
        
        <div className="mt-8 text-center sm:hidden">
          <Link to="/items" className="text-blue-600 hover:text-blue-800 font-medium">
            View All Items &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
