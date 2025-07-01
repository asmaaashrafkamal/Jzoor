import { NavLink } from 'react-router-dom';
import { FaUserCircle, FaBoxOpen } from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { RiCoupon2Line } from 'react-icons/ri';
import { FiLogOut } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { LuMessageCircleMore } from "react-icons/lu";


const links = [
  { label: 'My Account', path: '/profile', icon: <FaUserCircle />, title: 'Account' },
  { label: 'Orders', path: '/profile/orders', icon: <FaBoxOpen />, title: 'Orders' },
  { label: 'Notifications', path: '/profile/notifications', icon: <IoMdNotificationsOutline />, title: 'Notification' },
  { label: 'Chat', path: '/profile/chat', icon: <LuMessageCircleMore />, title: 'Chat' },
  { label: 'Log Out', path: '/', icon: <FiLogOut />, title: 'logout' },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* الخلفية المظللة في الشاشات الصغيرة */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed md:static top-0 left-0 h-full z-40 bg-white shadow rounded-r-lg transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          w-64 md:w-56 px-4 py-6 md:py-12`}
      >
        {/* زر الإغلاق للشاشات الصغيرة */}
        <div className="flex justify-end md:hidden mb-6">
          <button onClick={onClose} className="text-gray-700 text-2xl">
            <IoClose />
          </button>
        </div>
        <ul className="space-y-8 ml-0 pl-0">
          {links.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.path}
                title={link.title}
                end={link.path === '/profile'}
                className={({ isActive }) =>
                  `flex items-center justify-start gap-4 px-3 py-2 rounded-md text-md font-medium transition no-underline
                  ${isActive ? 'bg-[#A8C686]/50 text-green' : 'text-gray-700 hover:bg-gray-100'}`
                }
                onClick={onClose} // إغلاق القائمة بعد الضغط على أي رابط
              >
                <div className="text-xl">{link.icon}</div>
                <span className="inline">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
