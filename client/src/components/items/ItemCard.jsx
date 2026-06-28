import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const ItemCard = ({ item }) => {
  const isLost = item.type === 'lost';
  const badgeColor = isLost ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 bg-gray-200">
        {item.images && item.images.length > 0 ? (
          <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${badgeColor}`}>
          {item.type}
        </span>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{item.description}</p>
        
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <span className="font-medium mr-2">📍 Location:</span>
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-2">🕒 Date:</span>
            <span>{new Date(item.dateLostOrFound).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-2">🏷️ Category:</span>
            <span>{item.category}</span>
          </div>
        </div>
        
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </span>
          <Link 
            to={`/items/${item._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
