import { FaPhoneAlt, FaCommentDots, FaMapMarkedAlt } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveMapWidget = () => {
  const [isTracking, setIsTracking] = useState(false);
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const handleCall = () => {
    window.location.href = 'tel:+970590000000'; // ضع رقم الهاتف هنا
  };

  const handleChat = () => {
    navigate('/delivery/message');
  };

  const handleTrack = () => {
    setIsTracking(true);
  };

  // إرجاع الخريطة للحجم الطبيعي عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mapRef.current && !mapRef.current.contains(e.target)) {
        setIsTracking(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Live Map Widget Layout</h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className={`relative w-full ${isTracking ? 'h-96' : 'h-48'} rounded-md overflow-hidden mb-4 transition-all duration-500`}
        style={{ backgroundColor: '#E5E7EB' }}
      >
        <img
          src="/imges/map.png"
          alt="Map Placeholder"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/300x200/cccccc/333333?text=Map+Error';
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
      </div>

      {/* Location Info */}
      <p className="text-sm mb-2 text-gray-600">Current Location: Jatiala</p>
      <p className="text-sm mb-2 text-gray-600">Next Stop: Almosa/Gaza</p>
      <p className="text-sm mb-2 text-gray-600">ETA: 15 min</p>
      <div className="w-full rounded-full h-2.5 mb-2 bg-gray-200">
        <div className="h-2.5 rounded-full w-1/2 bg-green-500"></div>
      </div>
      <p className="text-sm text-gray-600">Progress: ●●●●●●● 3/6</p>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={handleCall}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 text-white bg-green  rounded-lg hover:bg-green-hover transition-all"
        >
          <FaPhoneAlt className="text-sm" />
          Call
        </button>

        <button
          onClick={handleChat}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all"
        >
          <FaCommentDots className="text-sm" />
          Chat
        </button>

        <button
          onClick={handleTrack}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-all"
        >
          <FaMapMarkedAlt className="text-sm" />
          Track
        </button>
      </div>
    </div>
  );
};

export default LiveMapWidget;