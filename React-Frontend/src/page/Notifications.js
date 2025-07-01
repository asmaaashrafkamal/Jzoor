import React, { useState } from 'react';

// Component for a single notification toggle switch
// This is placed inside NotificationsSettings as it's specific to it.
const NotificationToggle = ({ title, description, initialChecked }) => {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleToggleChange = () => {
    setIsChecked(!isChecked);
    // يمكنك إضافة منطق هنا لإرسال التغيير إلى الخادم أو إدارة الحالة العامة
    console.log(`${title} is now ${!isChecked ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1 pr-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <label htmlFor={`toggle-${title}`} className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={`toggle-${title}`}
          className="sr-only peer"
          checked={isChecked}
          onChange={handleToggleChange}
        />
        <div
          className={`w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 focus:-outline-none after:transition-all dark:border-gray-600 ${
            isChecked ? 'bg-green after:translate-x-full after:border-white' : 'bg-gray-300'
          }`}
        ></div>
      </label>
    </div>
  );
};

// Main Notifications Settings Component
function Notifications() {
  return (
    <div className="flex-1 bg-white p-6 rounded-xl shadow-lg font-inter">
      <h2 className="text-2xl font-bold text-green mb-6">Notifications</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Email Notification Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Email Notification</h3>
          <p className="text-sm text-gray-500 mb-6">
            Get emails to find out what's going on when you're not online. You can turn these off.
          </p>
          <div className="space-y-4">
            <NotificationToggle
              title="News"
              description="News about products and feature updates"
              initialChecked={true}
            />
            <NotificationToggle
              title="Updates"
              description="Feature updates"
              initialChecked={true}
            />
            <NotificationToggle
              title="User Research"
              description="Get involved in our beta testing program or participate in paid product user research."
              initialChecked={false}
            />
            <NotificationToggle
              title="Reminders"
              description="These are notifications to remind you of updates you might have missed."
              initialChecked={false}
            />
          </div>
        </div>

        {/* Push Notification Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Push Notification</h3>
          <p className="text-sm text-gray-500 mb-6">
            Get push notification in app to find out what's going on when you're online.
          </p>
          <div className="space-y-4">
            <NotificationToggle
              title="Reminders"
              description="These are notifications to remind you of updates you might have missed."
              initialChecked={true}
            />
            <NotificationToggle
              title="More activity about you"
              description="These are notifications for posts on your profile, likes and other reactions to your posts, and more."
              initialChecked={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;