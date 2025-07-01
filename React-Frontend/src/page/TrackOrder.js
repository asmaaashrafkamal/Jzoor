import React, { useState, useEffect } from 'react';
import { BiTimeFive } from 'react-icons/bi';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // تأكد من استيراد Link

const TrackOrder = () => {
  const [currentDeliveryPhase, setCurrentDeliveryPhase] = useState('waiting_pickup');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('15/02/25');
  const [deliveryStatusText, setDeliveryStatusText] = useState('On Time');
  const [driverName, setDriverName] = useState('Ahmad'); // هذا المتغير لم يُستخدم في الكود الحالي، يمكن إزالته إذا لم يكن له استخدام مستقبلي
  const [showOrderDetailsButtonActive, setShowOrderDetailsButtonActive] = useState(true);
  const [isCanceled, setIsCanceled] = useState(false);

  useEffect(() => {
    const simulateBackendUpdate = () => {
      setTimeout(() => setCurrentDeliveryPhase('picked_up'), 3000);
      setTimeout(() => setCurrentDeliveryPhase('pickup_done'), 6000);
      setTimeout(() => {
        setCurrentDeliveryPhase('out_for_delivery');
        setEstimatedDeliveryDate('15/02/25');
        setDeliveryStatusText('Out For Delivery');
      }, 9000);
      setTimeout(() => {
        setCurrentDeliveryPhase('delivered');
        setEstimatedDeliveryDate('14/02/25');
        setDeliveryStatusText('Delivered');
        setShowOrderDetailsButtonActive(true);
      }, 12000);
    };

    // شغل المحاكاة فقط إذا لم يكن الطلب ملغيًا بالفعل
    if (!isCanceled) {
      simulateBackendUpdate();
    }
  }, [isCanceled]); // أعد تشغيل التأثير عندما تتغير حالة الإلغاء

  const getOrderStatusSteps = () => {
    const steps = [
      { id: 1, label: 'Waiting Picked up', date: '10 Feb, 2025', phase: 'waiting_pickup' },
      { id: 2, label: 'Picked up', date: '10 Feb, 2025', phase: 'picked_up' },
      { id: 3, label: 'Order Processed', date: `We Are Waiting for Driver to Pick Up Product From Pickup Location`, phase: 'pickup_done', showDriverInfo: false },
      { id: 4, label: 'Out For Delivery', date: '15 Feb, 2025', phase: 'out_for_delivery' },
      { id: 5, label: 'Order Delivered', date: '', phase: 'delivered' },
    ];

    if (isCanceled) {
      let cancelledSteps = [];
      let currentPhaseIndex = steps.findIndex(s => s.phase === currentDeliveryPhase);

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        // إذا كان الطلب ملغى، فإن الخطوات التي لم تكتمل بعد تحصل على علامة X
        // currentDeliveryPhase !== 'canceled_state' هو شرط للتأكد من أننا لسنا في حالة إلغاء وهمية لا تحدد مرحلة فعلية
        const isPastOrCurrentBeforeCancel = (currentDeliveryPhase !== 'canceled_state' && i < currentPhaseIndex);

        cancelledSteps.push({
          ...step,
          completed: isPastOrCurrentBeforeCancel, // الخطوات المكتملة قبل الإلغاء
          isCanceledMark: !isPastOrCurrentBeforeCancel // علامة X على الخطوات التي لم تكتمل
        });
      }
      // أضف خطوة "Order Canceled" في النهاية
      cancelledSteps.push({ id: 6, label: 'Order Canceled', date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', ''), phase: 'canceled', completed: true, isCanceledStatus: true });
      return cancelledSteps;

    } else {
      let currentPhaseIndex = steps.findIndex(s => s.phase === currentDeliveryPhase);
      return steps.map((step, index) => ({
        ...step,
        completed: index <= currentPhaseIndex
      }));
    }
  };

  const orderStatusSteps = getOrderStatusSteps();

  const getIllustrationImage = () => {
    if (isCanceled) {
        return '/imges/cansle.webp'; // الصورة الخاصة بالإلغاء
    }
    switch (currentDeliveryPhase) {
      case 'out_for_delivery':
        return '/imges/map.png';
      case 'delivered':
        return '/imges/delivery.png';
      case 'waiting_pickup':
      case 'picked_up':
      case 'pickup_done':
      default:
        return '/imges/amico.png';
    }
  };

  const handleCancelOrder = () => {
    const confirmCancellation = window.confirm("Are you sure you want to cancel the order?");
    if (confirmCancellation) {
        setIsCanceled(true);
        // تحديث حالة النص إلى "Canceled" فورًا
        setDeliveryStatusText('Canceled'); // <--- هذا هو السطر الجديد
        setShowOrderDetailsButtonActive(false); // تعطيل زر تفاصيل الطلب
        alert("Order has been canceled. Please contact support for further assistance.");
    }
  };

  return (
    <div className="pt-[60px] md:pt-[120px] container min-h-screen px-4 md:px-0">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#4B5929]">Track Order</h1>
          <p className="text-[#6C757D] text-sm md:text-base">Keep In Touch With Your Order...</p>
        </div>
        <Link
          to="/orderDetails"
          className={`px-4 py-2 no-underline rounded-md font-semibold text-white transition ${
            showOrderDetailsButtonActive ? 'bg-[#4B5929] hover:bg-[#3c471f]' : 'bg-[#6C757D] cursor-not-allowed opacity-50 pointer-events-none'
          }`}
          onClick={(e) => {
            if (!showOrderDetailsButtonActive) {
              e.preventDefault();
            }
          }}
        >
          Show Order Details
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center bg-white p-2 rounded-lg shadow-md border border-[#E0E0E0]">
        {/* Left Section: Illustration */}
        <div className="flex justify-center items-center p-2">
          <img
            src={getIllustrationImage()}
            alt="Order Tracking Illustration"
            className="max-w-full h-auto object-contain"
          />
        </div>

        {/* Right Section: Order Status */}
        <div className="p-4">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#4B5929]">Order Status</h2>

          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#E0E0E0]">
            <div>
              <p className="text-[#6C757D] text-sm">Estimated Delivery Date</p>
              <p className="text-lg font-semibold text-[#4B5929]">{estimatedDeliveryDate}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isCanceled ? 'bg-[#F8D7DA] text-[#DC3545]' : // إذا كان ملغى، استخدم لون الإلغاء
                deliveryStatusText === 'On Time' || deliveryStatusText === 'Delivered' ? 'bg-[#D4EDDA] text-[#28A745]' :
                deliveryStatusText === 'Out For Delivery' ? 'bg-[#CCE5FF] text-[#007BFF]' :
                'bg-[#FFF3CD] text-[#FFC107]'
              }`}
            >
              {deliveryStatusText}
            </span>
          </div>

          {/* Order Tracking Steps */}
          <div className="relative border-l-2 border-[#E9ECEF] ml-2 pl-4 space-y-2">
            {orderStatusSteps.map((step) => (
              <div key={step.id} className="relative flex items-start">
                {step.isCanceledStatus ? ( // إذا كانت هذه هي خطوة الإلغاء النهائية
                    <div className="absolute -left-3.5 md:-left-4 top-0 w-7 h-7 rounded-full flex items-center justify-center bg-[#DC3545] text-white">
                        <FaTimes size={16} />
                    </div>
                ) : (
                    <div
                        className={`absolute -left-3.5 md:-left-4 top-0 w-7 h-7 rounded-full flex items-center justify-center ${
                            step.completed && !step.isCanceledMark ? 'bg-[#4B5929] text-white' : // مكتملة وليست ملغاة
                            step.isCanceledMark ? 'bg-[#DC3545] text-white' : // ملغاة بعلامة X
                            'bg-[#E9ECEF] text-[#6C757D]' // غير مكتملة
                        }`}
                    >
                        {step.completed && !step.isCanceledMark ? (
                            <BsCheckCircleFill size={16} />
                        ) : step.isCanceledMark ? (
                            <FaTimes size={16} />
                        ) : (
                            <div className="w-3 h-3 rounded-full bg-[#ADB5BD]"></div>
                        )}
                    </div>
                )}
                <div>
                  <p className={`font-semibold pl-5 ${step.completed && !step.isCanceledMark ? 'text-[#4B5929]' :
                                                  step.isCanceledMark ? 'text-[#DC3545] line-through' :
                                                  step.isCanceledStatus ? 'text-[#DC3545]' :
                                                  'text-[#6C757D]'}`}>
                    {step.label}
                  </p>
                  <p className="text-sm text-[#6C757D] pl-5">
                    {step.date}
                  </p>
                  {/* إزالة icons السائق من "Order Processed" إذا كان ذلك هو المطلوب */}
                  {step.phase !== 'pickup_done' && step.showDriverInfo && step.completed && !isCanceled && (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2 pl-5">
                      <MdOutlineLocalShipping size={20} className="text-[#4B5929]" />
                      <BiTimeFive size={20} className="text-[#4B5929]" />
                    </div>
                  )}
                  {step.phase === 'out_for_delivery' && step.completed && !isCanceled && (
                    <p className="text-[#007BFF] font-medium mt-2 pl-5">Stay Nearby</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Cancel Button */}
          {/* يظهر زر الإلغاء فقط إذا لم يكن الطلب قد تم تسليمه بعد ولم يتم إلغاؤه بالفعل */}
          {currentDeliveryPhase !== 'delivered' && !isCanceled && (
            <div className="flex justify-end mt-8">
              <button
                onClick={handleCancelOrder}
                className="px-6 py-2 bg-[#DC3545] text-white font-semibold rounded-md hover:bg-[#C82333] transition"
              >
                Cancel
              </button>
            </div>
          )}
           {/* نص "Order has been canceled" إذا تم الإلغاء */}
           {isCanceled && (
             <div className="mt-8 text-center text-lg font-bold text-[#DC3545]">
               Order has been canceled.
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;