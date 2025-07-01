import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
  // Static data for chat contacts
  const [contacts, setContacts] = useState([
    {
      id: '1',
      name: 'Amina Emad',
      lastMessage: 'Ok, got your order will be delivered soon',
      time: '9m',
      avatar: 'https://placehold.co/40x40/94A3B8/F8FAFC?text=AE',
      status: 'online',
      unread: 0,
    },
    {
      id: '2',
      name: 'Ahmad Ali',
      lastMessage: 'Sure',
      time: '1h',
      avatar: 'https://placehold.co/40x40/FECACA/EF4444?text=AA',
      status: 'offline',
      unread: 1,
    },
    {
      id: '3',
      name: 'Samia Baker',
      lastMessage: 'Thank You',
      time: '2h',
      avatar: 'https://placehold.co/40x40/D1FAE5/059669?text=SB',
      status: 'online',
      unread: 3,
    },
    {
      id: '4',
      name: 'Abeer Khaleel',
      lastMessage: 'Ok',
      time: '3h',
      avatar: 'https://placehold.co/40x40/BFDBFE/2563EB?text=AK',
      status: 'offline',
      unread: 0,
    },
    {
      id: '5',
      name: 'Mona Abd',
      lastMessage: 'Ok',
      time: '2d',
      avatar: 'https://placehold.co/40x40/DDD6FE/7C3AED?text=MA',
      status: 'online',
      unread: 0,
    },
    {
      id: '6',
      name: 'Yara Yaseen',
      lastMessage: 'Ok',
      time: '2w',
      avatar: 'https://placehold.co/40x40/DBEAFE/6D28D9?text=YY',
      status: 'offline',
      unread: 0,
    },
  ]);

  // Static data for chat messages
  const [messages, setMessages] = useState([
    {
      id: 'msg1',
      senderId: '3', // Samia Baker
      text: 'Omg, this is amazing',
      time: 'August 14',
      isMe: false,
    },
    {
      id: 'msg2',
      senderId: 'user', // Current user
      text: 'perfect!',
      time: 'August 14',
      isMe: true,
    },
    {
      id: 'msg3',
      senderId: '3', // Samia Baker
      text: 'Wow, this is totally EPIC',
      time: 'August 14',
      isMe: false,
    },
    {
      id: 'msg4',
      senderId: 'user', // Current user
      text: 'Thank You, Happy to help you, add app to help you more!',
      time: 'August 14',
      isMe: true,
    },
    {
      id: 'msg5',
      senderId: '3', // Samia Baker
      text: 'Hi...where are you now?',
      time: 'August 15',
      isMe: false,
    },
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [selectedContactId, setSelectedContactId] = useState('3');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        // Only close sidebar on resize if it was previously open on a larger screen
        // or if it's currently open on a small screen and the user hasn't explicitly opened it.
        // This prevents the sidebar from always closing when resizing below 768px if it was manually opened.
        if (isSidebarOpen && window.innerWidth < 768) {
             setIsSidebarOpen(false);
        } else if (!isSidebarOpen && window.innerWidth >= 768) {
            setIsSidebarOpen(true); // Reopen if user resizes back to desktop and it was open
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]); // Add isSidebarOpen to dependencies to re-evaluate on manual toggle


  const selectedContact = contacts.find(contact => contact.id === selectedContactId);

  const Icon = ({ name, size = 20, color = 'currentColor', className = '' }) => {
    switch (name) {
      case 'Menu':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        );
      case 'Search':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        );
      case 'MoreHorizontal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        );
      case 'Plus':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        );
      case 'Send':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        );
      case 'Smile':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        );
      case 'Paperclip':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21.44 11.02L13.02 2.6a2 2 0 0 0-2.83 0L3.6 9.19a2 2 0 0 0 0 2.83l8.42 8.42a2 2 0 0 0 2.83 0l7.82-7.82a2 2 0 0 0 0-2.83z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: `msg${messages.length + 1}`,
        senderId: 'user',
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="relative flex min-h-screen font-sans overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar - Contacts List Section */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md md:mt-2 md:ml-2 z-50 transition-transform duration-300 ease-in-out
                     ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                     md:relative md:translate-x-0 md:flex md:w-1/3 lg:w-1/4 xl:w-1/5 md:min-w-[280px] md:shadow-none
                     w-full max-w-[320px] sm:max-w-[360px] flex-col flex`}
        style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', borderRightWidth: '1px' }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-xl font-semibold" style={{ color: '#1A202C' }}>Inbox</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#D1FAE5', color: '#047857' }}>
            3 New
          </span>
          {/* Menu icon to close sidebar on mobile */}
          <button onClick={toggleSidebar} className="md:hidden p-1 rounded-md hover:bg-gray-100">
            <Icon name="Menu" size={20} color='#A0AEC0' />
          </button>
        </div>

        {/* Sidebar Search Input */}
        <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 text-sm" // Smaller text for search input
              style={{ backgroundColor: '#F8FAFC', borderColor: '#CBD5E0', color: '#1A202C', outlineColor: '#38A169' }}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon name="Search" size={16} color='#A0AEC0' /> {/* Smaller search icon */}
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100% - 130px)' }}>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center justify-between px-4 py-2 border-b border-b-gray-100 cursor-pointer transition-colors
                           ${selectedContactId === contact.id ? 'bg-[#D1FAE5]' : 'hover:bg-[#F3F4F6]'} `}
              style={{
                backgroundColor: selectedContactId === contact.id ? '#D1FAE5' : 'transparent',
                borderLeft: selectedContactId === contact.id ? '4px solid #38A169' : 'none',
              }}
              onClick={() => {
                setSelectedContactId(contact.id);
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0 flex-1"> {/* Added min-w-0 and flex-1 */}
                <div className="relative flex-shrink-0"> {/* Added flex-shrink-0 */}
                  <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
                  {contact.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#38A169', border: '1px solid #FFFFFF' }}></span>
                  )}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden"> {/* Added overflow-hidden to contain text */}
                  <p className="font-medium truncate text-sm sm:text-base" style={{ color: '#1A202C' }}>{contact.name}</p> {/* Responsive font size */}
                  <p className="text-xs sm:text-sm truncate" style={{ color: '#6B7280' }}>{contact.lastMessage}</p> {/* Responsive font size */}
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-xs" style={{ color: '#A0AEC0' }}>{contact.time}</p>
                {contact.unread > 0 && (
                  <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-xs font-bold mt-1" style={{ backgroundColor: '#38A169', color: '#FFFFFF' }}>
                    {contact.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area Section */}
      <div className={`flex flex-col flex-1 min-w-0 ${isSidebarOpen && window.innerWidth < 768 ? 'hidden' : 'flex'}`}> {/* Hide chat area on small screens when sidebar is open */}
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
          <button onClick={toggleSidebar} className="md:hidden p-1 rounded-md hover:bg-gray-100 flex-shrink-0"> {/* Added flex-shrink-0 */}
            <Icon name="Menu" size={20} /> {/* Smaller menu icon here */}
          </button>
          {selectedContact && (
            <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1 ml-2 md:ml-0 min-w-0"> {/* Added min-w-0 */}
              <div className="relative flex-shrink-0"> {/* Added flex-shrink-0 */}
                <img src={selectedContact.avatar} alt={selectedContact.name} className="w-10 h-10 rounded-full" />
                {selectedContact.status === 'online' && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#38A169', border: '1px solid #FFFFFF' }}></span>
                )}
              </div>
              <div className="min-w-0 overflow-hidden"> {/* Added min-w-0 and overflow-hidden for text */}
                <p className="font-semibold text-sm sm:text-base truncate" style={{ color: '#1A202C' }}>{selectedContact.name}</p>
                <p className="text-xs sm:text-sm truncate" style={{ color: '#4A5568' }}>{selectedContact.status === 'online' ? 'Online' : 'Offline'}</p>
              </div>
            </div>
          )}
          <Icon name="MoreHorizontal" size={20} color='#A0AEC0' className="flex-shrink-0" /> {/* Smaller icon, added flex-shrink-0 */}
        </div>

        {/* Messages Display */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4" style={{ backgroundColor: '#F8FAFC' }}> {/* Reduced padding slightly to p-4 */}
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              ابدأ المحادثة...
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isMe && (
                  <img
                    src={contacts.find(c => c.id === message.senderId)?.avatar || 'https://placehold.co/40x40/E2E8F0/A0AEC0?text=?'}
                    alt="Sender Avatar"
                    className="w-7 h-7 rounded-full mr-2 rtl:mr-0 rtl:ml-2 flex-shrink-0" // Smaller avatar here: w-7 h-7
                  />
                )}
                <div
                  className={`max-w-[75%] p-2 rounded-lg shadow-sm ${message.isMe
                    ? 'text-white'
                    : 'text-gray-900'
                  }`}
                  style={{
                    backgroundColor: message.isMe ? '#4299E1' : '#FFFFFF',
                  }}
                >
                  <p className="text-sm break-words">{message.text}</p>
                  <p className="text-xs text-right mt-1" style={{ color: message.isMe ? '#E2E8F0' : '#A0AEC0' }}>{message.time}</p>
                </div>
                {message.isMe && (
                  <img
                    src={contacts.find(c => c.id === 'user')?.avatar || 'https://placehold.co/40x40/E2E8F0/A0AEC0?text=U'}
                    alt="My Avatar"
                    className="w-7 h-7 rounded-full ml-2 rtl:ml-0 rtl:mr-2 flex-shrink-0" // Smaller avatar here: w-7 h-7
                  />
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <div className="p-3 border-t flex items-center space-x-2 rtl:space-x-reverse" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}> {/* Reduced padding to p-3, space-x-2 */}
          <Icon name="Plus" size={20} color='#A0AEC0' className="flex-shrink-0" /> {/* Smaller icons here, added flex-shrink-0 */}
          <Icon name="Smile" size={20} color='#A0AEC0' className="flex-shrink-0" />
          <Icon name="Paperclip" size={20} color='#A0AEC0' className="flex-shrink-0" />
          <input
            type="text"
            placeholder="Write a message..."
            className="flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 text-sm" // Reduced padding, smaller text
            style={{ backgroundColor: '#F8FAFC', borderColor: '#CBD5E0', color: '#1A202C', outlineColor: '#38A169' }}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button
            className="p-2 rounded-full flex items-center justify-center flex-shrink-0" // Reduced padding to p-2
            style={{ backgroundColor: '#4299E1', color: '#FFFFFF' }}
            onClick={handleSendMessage}
          >
            <Icon name="Send" size={18} /> {/* Smaller send icon */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;