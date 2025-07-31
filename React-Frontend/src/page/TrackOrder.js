import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { BiTimeFive } from 'react-icons/bi';
import { FiPhone } from 'react-icons/fi';
import { LuMessageCircle } from "react-icons/lu";

 // Importing the phone icon

// Phone Call Modal Component
const PhoneCallModal = ({ isOpen, onClose, phoneNumber }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 animate-scaleIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Driver</h2>
        <p className="text-gray-700 mb-6">You can call the driver at:</p>
        <div className="text-center mb-6">
          <a href={`tel:${phoneNumber}`} className="text-3xl font-bold text-blue-600 hover:underline">{phoneNumber}</a>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <a
            href={`tel:${phoneNumber}`}
            className="px-4 py-2 bg-[rgb(4,120,87)] text-white rounded-md hover:bg-green-700 transition-colors no-underline flex items-center justify-center"
          >
            Call Now
          </a>
        </div>
      </div>
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};


const TrackOrder = () => {
  const { orderId } = useParams(); // Get orderId from URL
  const [order, setOrder] = useState(null);
  const [isCanceled, setIsCanceled] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/order/${orderId}`);
        const normalizedStatus = res.data.status?.toLowerCase().replace(/\s+/g, '_');

        setOrder({
          ...res.data,
          status: normalizedStatus,
          status_text:normalizedStatus,
        });
  
        console.log('Order:', res.data);
        console.log('Normalized Status:', normalizedStatus);
  
        if (normalizedStatus === 'canceled') setIsCanceled(true);
        console.log(order);
        console.log(order.status);

      } catch (error) {
        console.error("Failed to fetch order", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  const isCompleted = (phase) => {
    if (!order || !order.status) return false;
  
    const phasesOrder = [
      'waiting_pickup',
      'picked_up',
      'out_for_delivery',
      'in_transit',
      'delivered',
    ];
  
    const currentIndex = phasesOrder.indexOf(order.status.toLowerCase());
    const checkIndex = phasesOrder.indexOf(phase);
  
    return checkIndex < currentIndex;
  };

  
  const getSteps = () => {
    if (!order) return [];
  
    const steps = [
      { id: 1, label: 'Waiting Picked up', date: order.waiting_pickup_at, phase: 'waiting_pickup' },
      { id: 2, label: 'Picked up', date: order.picked_up_at, phase: 'picked_up' },
      { id: 3, label: 'In Transit', date: order.in_transit_at, phase: 'in_transit', showDriverInfo: true },
      { id: 4, label: 'Out For Delivery', date: order.out_for_delivery_at, phase: 'out_for_delivery', showDriverInfo: true },
      { id: 5, label: 'Order Delivered', date: order.delivered_at, phase: 'delivered' },
    ];
  
    const currentPhase = order.status?.toLowerCase();
    const currentIndex = steps.findIndex(s => s.phase === currentPhase);
  
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      completed: index < currentIndex,
      active: index === currentIndex,
    }));
    if (isCanceled) {
      updatedSteps.push({
        id: 6,
        label: 'Order Canceled',
        date: order.canceled_at,
        phase: 'canceled',
        completed: true,
        isCanceledStatus: true
      });
    }
  
    return updatedSteps;
  };
  
  
  const getIllustrationImage = () => {
    if (isCanceled) return '/imges/cansle.webp';
  
    switch (order?.status?.toLowerCase()) {
      case 'in_transit': return '/imges/map.png';
      case 'out_for_delivery': return '/imges/map.png';
      case 'delivered': return '/imges/delivery.png';
      default: return '/imges/amico.png';
    }
  };
  

  const orderStatusSteps = getSteps();

  const handleCancelOrder = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (confirmCancel) {
      setIsCanceled(true);
      alert("Order has been canceled.");
    }
  };

  if (!order) {
    return <div className="pt-40 text-center">Loading order details...</div>;
  }

  return (
    <div className="pt-[60px] md:pt-[120px] container min-h-screen px-4 md:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#4B5929]">Track Order</h1>
          <p className="text-[#6C757D] text-sm md:text-base">Keep In Touch With Your Order...</p>
        </div>
        <Link
          to={`/orderDetails/${order.id}`}
          className={`px-4 py-2 no-underline rounded-md font-semibold text-white transition ${!isCanceled ? 'bg-[#4B5929] hover:bg-[#3c471f]' : 'bg-[#6C757D] cursor-not-allowed opacity-50 pointer-events-none'}`}
        >
          Show Order Details
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center bg-white p-2 rounded-lg shadow-md border border-[#E0E0E0]">
        <div className="flex justify-center items-center p-2">
          <img src={getIllustrationImage()} alt="Order Tracking" className="max-w-full h-auto object-contain" />
        </div>

        <div className="p-4">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#4B5929]">Order Status</h2>

          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#E0E0E0]">
            <div>
              <p className="text-[#6C757D] text-sm">Estimated Delivery Date</p>
              <p className="text-lg font-semibold text-[#4B5929]">{new Date(order.estimated_delivery_date).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isCanceled ? 'bg-[#F8D7DA] text-[#DC3545]' :
              order.status_text === 'On Time' || order.status_text === 'Delivered' ? 'bg-[#D4EDDA] text-[#28A745]' :
              order.status_text === 'Out For Delivery' ? 'bg-[#CCE5FF] text-[#007BFF]' :
              order.status_text === 'In Transit' ? 'bg-[#E2E3FF] text-[#5A54CF]' :
              'bg-[#FFF3CD] text-[#FFC107]'
            }`}>
              {isCanceled ? 'Canceled' : order.status_text}
            </span>

          </div>

          <div className="relative border-l-2 border-[#E9ECEF] ml-2 pl-4 space-y-2">
            {orderStatusSteps.map(step => (
              <div key={step.id} className="relative flex items-start">
                {step.isCanceledStatus ? (
                  <div className="absolute -left-3.5 md:-left-4 top-0 w-7 h-7 rounded-full flex items-center justify-center bg-[#DC3545] text-white">
                    <FaTimes size={16} />
                  </div>
                ) : (
                  <div className={`absolute -left-3.5 md:-left-4 top-0 w-7 h-7 rounded-full flex items-center justify-center ${
                    (step.completed || step.active) ? 'bg-[#4B5929] text-white' : 'bg-[#E9ECEF] text-[#6C757D]'
                  }`}>
                {(step.completed || step.active)
                  ? <BsCheckCircleFill size={16} />
                  : <div className="w-3 h-3 rounded-full bg-[#ADB5BD]"></div>}

                </div>
                )}

                <div>
                <p className={`font-semibold pl-5 ${
                  step.completed || step.active ? 'text-[#4B5929]' :
                  step.isCanceledStatus ? 'text-[#DC3545]' : 'text-[#6C757D]'
                }`}>
                    {step.label}
                  </p>
                  <p className="text-sm text-[#6C757D] pl-5">
                    {step.date ? new Date(step.date).toLocaleDateString() : step.date}
                  </p>

                  {step.showDriverInfo  && !isCanceled && (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2 pl-5">
                      <MdOutlineLocalShipping size={20} className="text-[#4B5929]" />
                      <BiTimeFive size={20} className="text-[#4B5929]" />
                      <Link to="/profile/chat">
                        <LuMessageCircle size={20} className="text-[#4B5929]" />
                      </Link>
                      <FiPhone size={20} className="text-[#4B5929] cursor-pointer" onClick={() => setShowCallModal(true)} />
                    </div>
                  )}
                  {(step.phase === 'out_for_delivery' || step.phase === 'in_transit') && step.completed && !isCanceled && (
                    <p className="text-[#007BFF] font-medium mt-2 pl-5">Stay Nearby</p>
                  )}
              
                </div>
              </div>
            ))}
          </div>

          {!isCanceled && order.status.toLowerCase() !== 'delivered' && (
            <div className="flex justify-end mt-8">
              <button onClick={handleCancelOrder} className="px-6 py-2 bg-[#DC3545] text-white font-semibold rounded-md hover:bg-[#C82333] transition">
                Cancel
              </button>
            </div>
          )}
          {isCanceled && (
            <div className="mt-8 text-center text-lg font-bold text-[#DC3545]">
              Order has been canceled.
            </div>
          )}
        </div>
      </div>

      {showCallModal && (
        <PhoneCallModal
          isOpen={showCallModal}
          onClose={() => setShowCallModal(false)}
          phoneNumber={order?.delivery_person?.phone || '123-456-7890'}
        />
      )}
    </div>
  );
};

export default TrackOrder;