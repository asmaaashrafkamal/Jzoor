import React, { useState, useEffect, useContext } from 'react';
import {
    FaBell, // عام للإشعارات
    FaShoppingCart, // للطلبات الجديدة
    FaEnvelope, // للرسائل
    FaExclamationTriangle, // للمخزون المنخفض
    FaStar, // للمراجعات
    FaCheckCircle, // للتم وضع علامة كمقروء
    FaArchive, // للأرشفة
    FaTrash, // للحذف
    FaEye, // لعرض التفاصيل
    FaTimes // لإغلاق المودال
} from 'react-icons/fa';
import Title from '../components/Title'; // افتراضيا هذا المسار صحيح
import useScrollReveal from '../assets/useScrollReveal'; // افتراضيا هذا المسار صحيح
// يمكن إضافة ProductContext إذا كانت الإشعارات مرتبطة ببيانات المنتجات مباشرة
// import { ProductContext } from '../context/ProductContext';
import { ProductContext } from '../context/ProductContext';



const DeliveryNotifications = () => {
      const {notification} =useContext(ProductContext)
    
    useScrollReveal('.reveal-bottom', 'default'); // استخدام ScrollReveal

    const [notifications, setNotifications] = useState(notification);
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Unread', 'Read'
    const [filterType, setFilterType] = useState('All'); // 'All', 'order', 'message', 'low_stock', 'review'

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    // فلترة الإشعارات بناءً على الحالة والنوع
    const filteredNotifications = notifications.filter(notification => {
        const statusMatch = filterStatus === 'All' ||
                            (filterStatus === 'Unread' && !notification.isRead) ||
                            (filterStatus === 'Read' && notification.isRead);

        const typeMatch = filterType === 'All' || notification.type === filterType;

        return statusMatch && typeMatch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date)); // ترتيب حسب الأحدث

    // وظيفة لوضع علامة على إشعار كمقروء
    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif => (notif.id === id ? { ...notif, isRead: true } : notif))
        );
        // في تطبيق حقيقي: إرسال طلب للـ Backend لتحديث الحالة
    };

    // وظيفة لأرشفة إشعار (يمكن اعتبارها حذف ناعم أو نقل لمكان آخر)
    const archiveNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        alert(`Notification ${id} archived.`);
        // في تطبيق حقيقي: إرسال طلب للـ Backend
    };

    // وظيفة لحذف إشعار نهائياً
    const deleteNotification = (id) => {
        if (window.confirm("Are you sure you want to permanently delete this notification?")) {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
            alert(`Notification ${id} deleted.`);
            // في تطبيق حقيقي: إرسال طلب للـ Backend
        }
    };

    // وظيفة لوضع علامة على كل الإشعارات غير المقروءة كمقروءة
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        alert("All unread notifications marked as read.");
        // في تطبيق حقيقي: إرسال طلب للـ Backend
    };

    // فتح نافذة تفاصيل الإشعار المنبثقة
    const openNotificationDetailsModal = (notification) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);
        // وضع علامة كمقروء عند فتح التفاصيل
        markAsRead(notification.id);
    };

    // إغلاق نافذة تفاصيل الإشعار المنبثقة
    const closeNotificationDetailsModal = () => {
        setIsModalOpen(false);
        setSelectedNotification(null);
    };

    return (
        <div className="bg-[#fdf9f3] min-h-screen">
            <section className="py-[30px] md:py-[50px] container mx-auto px-4" id="AdminNotifications">
                <Title
                    name="Seller Notifications"
                    description="View and manage all system alerts and updates."
                />

                {/* Filter and Mass Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 reveal-bottom">
                    {/* Filter by Status */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterStatus('All')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterStatus === 'All' ? 'bg-[#4B5929] text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus('Unread')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterStatus === 'Unread' ? 'bg-[#af926a] text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                        >
                            Unread
                        </button>
                        <button
                            onClick={() => setFilterStatus('Read')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterStatus === 'Read' ? 'bg-gray-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                        >
                            Read
                        </button>
                    </div>

                    {/* Filter by Type */}
                    <div className="flex gap-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4B5929]"
                        >
                            <option value="All">All Types</option>
                            <option value="order">Orders</option>
                            <option value="message">Messages</option>
                            <option value="low_stock">Low Stock</option>
                            <option value="review">Reviews</option>
                            {/* يمكنك إضافة المزيد من الأنواع هنا */}
                        </select>
                    </div>

                    {/* Mass Actions */}
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 bg-[#4B5929] text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-[#A8C686] transition-all duration-300 text-sm"
                    >
                        <FaCheckCircle /> Mark All Read
                    </button>
                </div>

                {/* Notifications List */}
                <div className="content">
                    <div className="cards sm:py-2 md:py-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredNotifications.length === 0 ? (
                                <p className="col-span-full text-center text-gray-600 text-lg">No notifications found matching your criteria.</p>
                            ) : (
                                filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`reveal-top-Notification bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-5 border-l-4
                                            ${notification.isRead ? 'border-gray-300' : 'border-[#4B5929]'}
                                            ${!notification.isRead ? 'bg-blue-50/50' : ''}
                                            relative flex flex-col gap-2`}
                                    >
                                        {!notification.isRead && (
                                            <span className="absolute top-2 right-2 bg-red text-white text-xs px-2 py-1 rounded-full font-bold">New</span>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{notification.icon}</div>
                                            <h3 className="text-lg font-semibold text-gray-800 flex-1">{notification.title}</h3>
                                        </div>
                                        <p className="text-gray-600 text-sm">{notification.description}</p>
                                        <p className="text-gray-400 text-xs">
                                            {new Date(notification.date).toLocaleString()}
                                        </p>

                                        <div className="flex gap-2 mt-3 flex-wrap">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="flex items-center gap-1 text-[#4B5929] text-sm hover:text-[#A8C686] transition"
                                                >
                                                    <FaCheckCircle /> Mark Read
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openNotificationDetailsModal(notification)}
                                                className="flex items-center gap-1 text-[#af926a] text-sm hover:text-[#8B6F47] transition"
                                            >
                                                <FaEye /> View Details
                                            </button>
                                            <button
                                                onClick={() => archiveNotification(notification.id)}
                                                className="flex items-center gap-1 text-gray-500 text-sm hover:text-gray-700 transition"
                                            >
                                                <FaArchive /> Archive
                                            </button>
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="flex items-center gap-1 text-red text-sm hover:text-red transition"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Notification Details Modal */}
                {isModalOpen && selectedNotification && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="relative bg-white p-6 rounded-2xl shadow-xl max-w-2xl w-full mx-auto animate-scale-in max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={closeNotificationDetailsModal}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <FaTimes size={24} />
                            </button>

                            <div className="flex flex-col gap-4 text-[#4B5929]">
                                <div className="flex items-center gap-3 border-b pb-3 mb-3">
                                    <div className="text-4xl">{selectedNotification.icon}</div>
                                    <h2 className="text-2xl font-bold">{selectedNotification.title}</h2>
                                </div>

                                <p className="text-gray-700 text-base leading-relaxed">
                                    {selectedNotification.details || selectedNotification.description}
                                </p>

                                <p className="text-gray-500 text-sm mt-2">
                                    Date: {new Date(selectedNotification.date).toLocaleString()}
                                </p>

                                {selectedNotification.link && (
                                    <a
                                        href={selectedNotification.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#af926a] text-white px-5 py-2 rounded-md hover:bg-[#8B6F47] transition font-semibold self-start"
                                    >
                                        Go to related page
                                        <FaEye />
                                    </a>
                                )}

                                <div className="flex gap-3 mt-4 justify-end">
                                    {!selectedNotification.isRead && (
                                        <button
                                            onClick={() => {
                                                markAsRead(selectedNotification.id);
                                                setSelectedNotification(prev => ({ ...prev, isRead: true })); // Update modal state
                                            }}
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-semibold text-sm"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            archiveNotification(selectedNotification.id);
                                            closeNotificationDetailsModal(); // Close modal after action
                                        }}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition font-semibold text-sm"
                                    >
                                        Archive
                                    </button>
                                    <button
                                        onClick={() => {
                                            deleteNotification(selectedNotification.id);
                                            closeNotificationDetailsModal(); // Close modal after action
                                        }}
                                        className="bg-red text-white px-4 py-2 rounded-md hover:bg-red-700 transition font-semibold text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default DeliveryNotifications;