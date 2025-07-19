import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  FiTruck, FiPackage, FiClock, FiMapPin, FiSearch, FiPhone, FiMap,
  FiMoreVertical, FiChevronLeft, FiChevronRight, FiFilter, FiEdit,
  FiEye, FiCheck, FiX, FiCreditCard, FiMessageSquare
} from 'react-icons/fi';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';

// Helper function to render Lucide-like icons using react-icons/fi
const Icon = ({ name, size = 20, color = 'currentColor', className = '' }) => {
  switch (name) {
    case 'Truck': return <FiTruck size={size} color={color} className={className} />;
    case 'Package': return <FiPackage size={size} color={color} className={className} />;
    case 'Clock': return <FiClock size={size} color={color} className={className} />;
    case 'MapPin': return <FiMapPin size={size} color={color} className={className} />;
    case 'Search': return <FiSearch size={size} color={color} className={className} />;
    case 'Phone': return <FiPhone size={size} color={color} className={className} />;
    case 'LocateFixed': return <FiMap size={size} color={color} className={className} />;
    case 'MoreVertical': return <FiMoreVertical size={size} color={color} className={className} />;
    case 'ChevronLeft': return <FiChevronLeft size={size} color={color} className={className} />;
    case 'ChevronRight': return <FiChevronRight size={size} color={color} className={className} />;
    case 'Filter': return <FiFilter size={size} color={color} className={className} />;
    case 'Edit': return <FiEdit size={size} color={color} className={className} />;
    case 'Eye': return <FiEye size={size} color={color} className={className} />;
    case 'Check': return <FiCheck size={size} color={color} className={className} />;
    case 'X': return <FiX size={size} color={color} className={className} />;
    case 'CreditCard': return <FiCreditCard size={size} color={color} className={className} />;
    case 'Chat': return <FiMessageSquare size={size} color={color} className={className} />;
    default: return null;
  }
};

// Placeholder for LiveMapWidget
const LiveMapWidget  = ({ lat, lng }) => {
  const position = [lat, lng];
  return (
    <MapContainer center={position} zoom={13} style={{ height: '200px', width: '100%' }} className="rounded-lg">
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png' })}>
        <Popup>
          Delivery Person<br />
          Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
        </Popup>
      </Marker>
    </MapContainer>
  );
};


// OrderDetailsModal Component - Chat button removed
const OrderDetailsModal = ({ isOpen, onClose, order, onStatusUpdate, currentLocation }) => {
  const modalRef = useRef(null);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setShowLiveMap(false);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  const modalContentContainerStyle = {
    backgroundColor: '#F3F4F6', borderRadius: '0.75rem', maxHeight: '90vh',
    width: '95%', maxWidth: '1200px', overflowY: 'auto',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    display: 'flex', flexDirection: 'column'
  };

  const modalHeaderStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 1.5rem', backgroundColor: '#FFF', borderBottom: '1px solid #E5E7EB',
    borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem'
  };

  const closeButtonStyle = {
    backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.375rem'
  };

  const modalBodyStyle = {
    padding: '1.5rem', flexGrow: 1, overflowY: 'auto', backgroundColor: '#F3F4F6'
  };

 const handleCall = () => {
  const phone = order?.customerDetails?.phone || '+970590000000'; // fallback if phone is missing
  window.location.href = `tel:${phone}`;
};

  const handleChat = () => {
    navigate('/delivery/message');
  };
  return (
    <div className="modal-overlay" style={modalOverlayStyle}>
      <div ref={modalRef} className="modal-content-container" style={modalContentContainerStyle}>
        <div className="modal-header" style={modalHeaderStyle}>
          <h2 className="text-xl font-semibold" style={{ color: '#1F2937' }}>Order Details</h2>
          <button onClick={onClose} className="close-button" style={closeButtonStyle}>
            <Icon name="X" size={24} color="#9CA3AF" />
          </button>
        </div>
        <div className="modal-body" style={modalBodyStyle}>
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4 md:mb-0">
                <img
                  src={`http://localhost:8000/storage/${order.avatar || 'default.jpg'}`}
                  alt={order.customerDetails.name}
                  className="w-16 h-16 rounded-full border-2"
                  style={{ borderColor: '#E5E7EB' }}
                />
                <div>
                <p className="text-lg font-semibold text-gray-900">{order.customerDetails.name}</p>
                <p className="text-sm text-gray-500">(ID: {order.customerDetails.id})</p>
                <p className="text-sm text-gray-500">{order.customerDetails.location}</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end space-y-2">
              <p className="text-sm font-medium text-gray-600">Assigned: {order.customerDetails.assignedTime}</p>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#22C55E' }} onClick={handleCall}>
                  <Icon name="Phone" size={16} /> <span>Call</span>
                </button>
                <button className="flex items-center space-x-1 px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#22C55E' }} onClick={handleChat}>
                  <Icon name="Chat" size={16} /> <span>Chat</span>
                </button>
                {/* Chat button removed */}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center relative py-4 mb-6 px-4 bg-white rounded-lg shadow-sm">
            {order.progress.map((step, index) => {
              const isCanceledOrder = order.status === 'Canceled';
              const isCurrentStepCanceled = step === 'Canceled';
              const isActiveStepInNormalFlow = index <= order.currentProgressIndex && !isCanceledOrder;

              let circleBgColor = '#FFFFFF';
              let circleBorderColor = '#D1D5DB';
              let textColor = '#6B7280';
              let lineColor = '#D1D5DB';
              let iconComponent = null;

              if (isCanceledOrder && isCurrentStepCanceled) {
                circleBgColor = '#DC2626';
                circleBorderColor = '#DC2626';
                iconComponent = <Icon name="X" size={12} color="white" />;
              } else if (isActiveStepInNormalFlow) {
                circleBgColor = '#22C55E';
                circleBorderColor = '#22C55E';
                iconComponent = <Icon name="Check" size={12} color="white" />;
              }

              if (index < order.progress.length - 1) {
                const nextStep = order.progress[index + 1];
                const nextStepIsCanceled = nextStep === 'Canceled';
                if (isCanceledOrder && (isCurrentStepCanceled || (order.currentProgressIndex > index && nextStepIsCanceled))) {
                  lineColor = '#DC2626';
                } else if (index < order.currentProgressIndex && !isCanceledOrder) {
                  lineColor = '#22C55E';
                }
              }

              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center flex-1 min-w-0 cursor-pointer" onClick={() => onStatusUpdate(order.orderId, step)}>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ backgroundColor: circleBgColor, borderColor: circleBorderColor, minWidth: '20px', minHeight: '20px' }}>
                      {iconComponent}
                    </div>
                    <p className={`mt-2 text-xs text-center ${index === order.currentProgressIndex ? 'font-semibold' : 'font-normal'}`} style={{ color: textColor }}>
                      {step.replace(' ', '\n')}
                    </p>
                  </div>
                  {index < order.progress.length - 1 && (
                    <div className="flex-1 h-0.5" style={{ backgroundColor: lineColor }}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Order Id: {order.customerDetails.orderNumber}</h3>
                <span className="text-sm font-medium text-gray-500">{order.customerDetails.itemsCount} Items</span>
              </div>
              <div className="space-y-3">
                {order.customerDetails.products.map((product, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <img
                      src={`http://localhost:8000/storage/${product.image}`}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price}.00</p>
                      <p className="text-xs text-gray-400">{product.quantity} Items</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Location Details</h3>
        {showLiveMap && currentLocation?.lat && currentLocation?.lng ? (
  <LiveMapWidget
    lat={currentLocation.lat}
    lng={currentLocation.lng}
  />
) : (
  <>
    <img src="/imges/map.png" alt="map" className="w-full h-48 object-cover rounded-lg mb-4" />
    <div className="space-y-2 text-sm text-gray-600">
      <p className="font-medium">ETA: {order.customerDetails.locationDetails.eta}</p>
      <p>
        Current Location:{' '}
        {currentLocation?.lat && currentLocation?.lng
          ? `Lat: ${currentLocation.lat}, Lng: ${currentLocation.lng}`
          : 'Location not available'}
      </p>
      <p>Customer Location: {order.customerDetails.locationDetails.customerLocation}</p>
    </div>
  </>
)}

              <button className="flex items-center space-x-2 px-4 py-2 mt-4 rounded-lg text-white font-medium w-full justify-center" style={{ backgroundColor: '#22C55E' }} onClick={() => setShowLiveMap(!showLiveMap)}>
                <Icon name="LocateFixed" size={16} />
                <span>{showLiveMap ? 'Hide Map' : 'Track'}</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Payment Details</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.customerDetails.paymentDetails.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Cost</span>
                  <span className="font-semibold text-green-500">{order.customerDetails.paymentDetails.shippingCost}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span>{order.customerDetails.products[0]?.discount || '0%'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 text-gray-900">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">${order.customerDetails.paymentDetails.total}</span>
                </div>
              </div>
              <h4 className="font-semibold mb-2 text-gray-900">Credit Card</h4>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-300">
                <div className="flex items-center space-x-2">
                  <Icon name="CreditCard" size={24} color="#9CA3AF" />
                  <span className="font-medium text-gray-900">{order.customerDetails.paymentDetails.creditCard}</span>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Order Statuses: <span className="font-semibold text-blue-600 inline-flex items-center space-x-1"><FiTruck size={16} /> {order.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('All orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
useEffect(() => {
  const interval = setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting location:', error.message);
      }
    );
  }, 10000); // update every 10 seconds

  return () => clearInterval(interval);
}, []);
// Chart refs at the top
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
useEffect(() => {
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    (error) => {
      console.error('Error getting location:', error.message);
    }
  );
}, []);


  useEffect(() => {
    axios.get('http://localhost:8000/api/active-orders', {
      params: { delivery_person_id: 5 },
    })
      .then(res => {
        const transformed = res.data.map(order => ({
          orderId: order.id,
          status: order.status,
          clientName: order.user.full_name,
          address: order.user.address,
          assignedTime: order.created_at || '10:00 AM',
          avatar: order.user.image || '/default.jpg',
          progress: ['Waiting Picked up', 'Picked Up', 'In Transit', 'Delivered', 'Canceled'],
          currentProgressIndex: ['Waiting Picked up', 'Picked Up', 'In Transit', 'Delivered', 'Canceled'].indexOf(order.status),
          customerDetails: {
            id: order.user.id,
            name: order.user.full_name,
            orderNumber: order.id,
            location: order.user.address,
            locationDetails: {
                 eta: '15 mins',
                currentLocation: currentLocation?.lat && currentLocation?.lng
                  ? `Lat: ${currentLocation.lat}, Lng: ${currentLocation.lng}`
                  : 'Unavailable',
            customerLocation: order.user.address,
            },
            paymentDetails: {
              subtotal: order.total_price - 10,
              shippingCost: 10,
              total: order.total_price,
              creditCard: order.payment?.card_last4 ? `**** **** **** ${order.payment.card_last4}` : 'Cash',
            },
            products: order.items.map(item => ({
              name: item.product.name,
              image: item.product.image,
              price: item.product.price,
              discount: item.product.discounted_price,
              quantity: item.quantity,
            })),
            itemsCount: order.items.length
          }
        }));
        setRecentOrders(transformed);
      })
      .catch(err => console.error('Failed to fetch active orders', err));
  }, []);
 useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const statusCounts = {
      'Waiting Picked up': 0,
      'Picked Up': 0,
      'In Transit': 0,
      'Delivered': 0,
      'Canceled': 0,
    };
    recentOrders.forEach(order => {
      if (statusCounts[order.status] !== undefined) {
        statusCounts[order.status]++;
      }
    });
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          label: 'Orders by Status',
          data: Object.values(statusCounts),
          backgroundColor: [
            '#E5E7EB', '#3B82F6', '#FACC15', '#22C55E', '#DC2626'
          ],
        }]
      },
 options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }, [recentOrders]);
  const handleProgressStepClick = useCallback(async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/orders/${orderId}/status`, { status: newStatus });
      setRecentOrders(prevOrders =>
        prevOrders.map(order => {
          if (order.orderId === orderId) {
            const newProgressIndex = order.progress.indexOf(newStatus);
            return {
              ...order,
              status: newStatus,
              currentProgressIndex: newProgressIndex,
            };
          }
          return order;
        })
      );
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update order status.');
    }
  }, []);

  // Pagination logic
  const filteredOrders = recentOrders.filter(order =>
    order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Order Dashboard</h1>
   {/* Chart at the top */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <canvas ref={chartRef} height="80"></canvas>
      </div>
      <div className="flex items-center mb-4">
        <input
              type="text"
              placeholder="Search in logistic history"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: '#E2E8F0', // Light gray border
                backgroundColor: '#F7FAFC', // Very light gray background
                color: '#2D3748', // Dark gray text
                outlineColor: '#065F46', // Green ring on focus
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
          onClick={() => setCurrentPage(1)}
        >
              <FiSearch size={18} style={{ color: '#A0AEC0' }} /> {/* React Icon: FiSearch */}
               </button>
      </div>
      <div className="grid gap-6">
        {paginatedOrders.map(order => (
          <div
            key={order.orderId}
            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
            onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
          >
            <div className="flex items-center space-x-4">
                <img
                  src={`http://localhost:8000/storage/${order.customerDetails.products[0]?.image || 'default.jpg'}`}
                  alt={order.clientName}
                  className="w-12 h-12 rounded-full border"
                />
              <div>
                <div className="font-semibold text-gray-900">{order.clientName}</div>
                <div className="text-sm text-gray-500">{order.address}</div>
                <div className="text-xs text-gray-400">Assigned: {order.assignedTime}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                backgroundColor: order.status === 'Delivered' ? '#22C55E' :
                  order.status === 'In Transit' ? '#FACC15' :
                    order.status === 'Picked Up' ? '#3B82F6' :
                      order.status === 'Waiting Picked up' ? '#E5E7EB' : '#DC2626',
                color: order.status === 'Waiting Picked up' ? '#374151' : '#fff'
              }}>
                {order.status}
              </span>
              <Icon name="ChevronRight" size={20} color="#9CA3AF" />
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          className="p-2 rounded-full border"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        >
          <Icon name="ChevronLeft" size={20} />
        </button>
        <span className="px-4">{currentPage} / {totalPages || 1}</span>
        <button
          className="p-2 rounded-full border"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        >
          <Icon name="ChevronRight" size={20} />
        </button>
      </div>
      {/* Modal */}
     <OrderDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
          onStatusUpdate={handleProgressStepClick}
          currentLocation={currentLocation} // ✅ Add this line
     />
    </div>
  );
};

export default OrderDashboard;
