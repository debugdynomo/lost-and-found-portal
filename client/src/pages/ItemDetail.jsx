import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleClaim = async () => {
    if (!claimMessage.trim()) {
      setClaimError('Please provide a message');
      return;
    }
    try {
      setClaimError('');
      await api.post('/claims', { item: id, message: claimMessage });
      setClaimSuccess(true);
      setShowClaimModal(false);
      setClaimMessage('');
    } catch (err) {
      setClaimError(err.response?.data?.error || 'Failed to submit claim');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-96 bg-gray-200 rounded-xl mb-8" />
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
        <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or has been removed.</p>
        <Link to="/items" className="text-blue-600 hover:underline font-medium">← Back to Items</Link>
      </div>
    );
  }

  const isOwner = user && item.postedBy && user._id === item.postedBy._id;
  const isLost = item.type === 'lost';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/items" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium">
        ← Back to Items
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Image Gallery */}
        {item.images && item.images.length > 0 ? (
          <div>
            <div className="h-80 md:h-96 bg-gray-200">
              <img
                src={item.images[activeImage]?.url}
                alt={item.title}
                className="w-full h-full object-contain bg-gray-100"
              />
            </div>
            {item.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      idx === activeImage ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
            No images available
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isLost ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {item.type}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
              {item.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              item.status === 'active' ? 'bg-blue-100 text-blue-800' :
              item.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {item.status}
            </span>
          </div>

          {/* Title & Description */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>
          <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">{item.description}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-lg">📍</span>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Location</p>
                <p className="font-medium text-gray-900">{item.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">📅</span>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Date {isLost ? 'Lost' : 'Found'}</p>
                <p className="font-medium text-gray-900">{new Date(item.dateLostOrFound).toLocaleDateString()}</p>
              </div>
            </div>
            {item.contactInfo?.email && (
              <div className="flex items-start gap-3">
                <span className="text-lg">📧</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Contact Email</p>
                  <p className="font-medium text-gray-900">{item.contactInfo.email}</p>
                </div>
              </div>
            )}
            {item.contactInfo?.phone && (
              <div className="flex items-start gap-3">
                <span className="text-lg">📱</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Contact Phone</p>
                  <p className="font-medium text-gray-900">{item.contactInfo.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Posted By */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {item.postedBy?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.postedBy?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">
                  Posted {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isOwner ? (
              <>
                <Link
                  to={`/items/${item._id}/edit`}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Edit Item
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </>
            ) : user && item.status === 'active' ? (
              claimSuccess ? (
                <div className="px-6 py-2.5 bg-green-50 text-green-700 rounded-lg font-medium">
                  ✓ Claim submitted successfully
                </div>
              ) : (
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Claim This Item
                </button>
              )
            ) : !user ? (
              <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Login to Claim
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Submit a Claim</h3>
            <p className="text-sm text-gray-600 mb-4">
              Explain why you believe this item belongs to you (or who you'd like to return it to).
            </p>
            {claimError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{claimError}</div>
            )}
            <textarea
              value={claimMessage}
              onChange={(e) => setClaimMessage(e.target.value)}
              placeholder="Describe identifying details..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-32"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleClaim}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Submit Claim
              </button>
              <button
                onClick={() => { setShowClaimModal(false); setClaimError(''); }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
