import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalItems: 0, resolvedItems: 0, activeClaims: 0 });
  const [myItems, setMyItems] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [sentClaims, setSentClaims] = useState([]);
  const [activeTab, setActiveTab] = useState('items');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, itemsRes, receivedRes, sentRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/items/my-items'),
          api.get('/claims/received'),
          api.get('/claims/sent')
        ]);
        setStats(statsRes.data.data);
        setMyItems(itemsRes.data.data);
        setReceivedClaims(receivedRes.data.data);
        setSentClaims(sentRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleClaimResponse = async (claimId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this claim?`)) return;
    try {
      await api.patch(`/claims/${claimId}/respond`, { status });
      // Refresh claims
      const res = await api.get('/claims/received');
      setReceivedClaims(res.data.data);
      // Refresh stats
      const statsRes = await api.get('/users/stats');
      setStats(statsRes.data.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update claim');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/items/${itemId}`);
      setMyItems(prev => prev.filter(item => item._id !== itemId));
      const statsRes = await api.get('/users/stats');
      setStats(statsRes.data.data);
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-xl h-32 shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/items/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          + Post Item
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Total Items Posted</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalItems}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Items Resolved</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolvedItems}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Active Claims</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.activeClaims}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-8">
        {[
          { key: 'items', label: 'My Items', count: myItems.length },
          { key: 'received', label: 'Claims Received', count: receivedClaims.length },
          { key: 'sent', label: 'Claims Sent', count: sentClaims.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {myItems.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">You haven't posted any items yet.</p>
              <Link to="/items/new" className="text-blue-600 hover:underline font-medium">Post your first item →</Link>
            </div>
          ) : (
            myItems.map(item => (
              <div key={item._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                    {item.images?.[0] ? (
                      <img src={item.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link to={`/items/${item._id}`} className="font-semibold text-gray-900 hover:text-blue-600 truncate block">
                      {item.title}
                    </Link>
                    <div className="flex gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>{item.type}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        item.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'claimed' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>{item.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link to={`/items/${item._id}/edit`} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Edit</Link>
                  <button onClick={() => handleDeleteItem(item._id)} className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedClaims.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No claims received yet.</p>
            </div>
          ) : (
            receivedClaims.map(claim => (
              <div key={claim._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {claim.claimant?.name} wants to claim <Link to={`/items/${claim.item?._id}`} className="text-blue-600 hover:underline">{claim.item?.title}</Link>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{claim.claimant?.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>{claim.status}</span>
                </div>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg mb-3">"{claim.message}"</p>
                {claim.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleClaimResponse(claim._id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleClaimResponse(claim._id, 'rejected')}
                      className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentClaims.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">You haven't submitted any claims yet.</p>
            </div>
          ) : (
            sentClaims.map(claim => (
              <div key={claim._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    Claim on <Link to={`/items/${claim.item?._id}`} className="text-blue-600 hover:underline">{claim.item?.title}</Link>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{claim.item?.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>{claim.status}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
