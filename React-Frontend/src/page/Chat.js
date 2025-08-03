import React, { useState, useEffect, useRef, useId } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useAuthContext } from '../context/AuthLogin';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Chat = () => {
    const [contacts, setContacts] = useState([]);
    const {login}= useAuthContext();
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const driverId = location.state?.driverId;
console.log(driverId);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [selectedContactId, setSelectedContactId] = useState('3');
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [gender, setGender] = useState('');
    const [state, setState] = useState('');
    const [address, setAdressName] = useState('');
    const [Birth_date, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [userId, setId] = useState('');
    
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };
      const countUnread = (messages, senderId) => {
        return messages.filter(
          msg => msg.sender_id === senderId && !msg.read
        ).length;
      };
      
      
    const navigate = useNavigate();
   
  useEffect(() => {
    axios.get("http://localhost:8000/check-login", { withCredentials: true })
      .then(res => {
         console.log(res.data);
        if (res.data.role == "C") {
        const u = res.data.user;
        setUser(u);
        setId(u.customer_id || '');
        setFullName(u.customer_name || '');
        setEmail(u.customer_email || '');
        setPhone(u.customer_phone || '');
        setBirthDate(u.customer_date || '');
        setGender(u.customer_gender || '');
        setState(u.customer_state || '');
        setAdressName(u.customer_address || '');
        // login(u);
    } else {
         // If no session, redirect to login page
          navigate("/login");
        }
      })
      .catch(() => {
        // On any error, redirect to login page
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);
  const driverToken = localStorage.getItem('token'); // Or however you store it
console.log('customer',userId);
useEffect(() => {
  axios.get(`http://localhost:8000/chat/admin/${driverId}`,{ withCredentials: true }, {
    params: { customer_id: userId },
    headers: {
      Authorization: `Bearer ${driverToken}`,
    },
  })
  .then((res) => {
    const currentUserId = userId; // From context or auth

    if (!res.data.message || res.data.message.length === 0) {
      SendMessage("hello",currentUserId,driverId);
    } else {
      const formatted = res.data.messages.map(msg => ({
        id: msg.id,
        text: msg.message,
        time: new Date(msg.created_at).toLocaleTimeString(),
        isMe: msg.sender_id === userId,
        senderId: msg.sender_id,
        senderRole: msg.sender_type,
      }));
      setMessages(formatted);
    }
  })
  .catch((err) => {
    console.error("Failed to fetch driver chat", err);
  });
}, [userId, driverId, driverToken]); // watch these values
 
const SendMessage = async (message, userId, driverId) => {
  const messageToSend = message?.trim() || newMessage?.trim();
  if (!messageToSend) return;

  setNewMessage(''); // Clear input field

  try {
    const response = await fetch('http://localhost:8000/chat/send', {
      method: 'POST',
      withCredentials: true, // correct usage for sending cookies/session
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${driverToken}`,
      },
      body: JSON.stringify({
        receiver_id: driverId,
        sender_id: userId,
        message: messageToSend,
        sender_type: 'user',
        receiver_type: 'driver',
      }),
    });
    
    const data = await response.json();

    if (data.success && data.data) {
      const msg = data.data;
      const formattedMessage = {
        id: msg.id,
        text: msg.message,
        time: new Date(msg.created_at).toLocaleTimeString(),
        isMe: msg.sender_id === userId,
        senderId: msg.sender_id,
        senderRole: msg.sender_type,
      };

      // 1. Add message to UI
      setMessages(prev => [...prev, formattedMessage]);

      // 2. Refresh contacts
      getAllMessages();

      // 3. ✅ Auto-open chat with the receiver
      setSelectedContactId(driverId);       // ← activate the chat
      handleContactClick(driverId);         // ← load messages for this chat
    } else {
      console.error('Message send failed: ', data);
    }

  } catch (error) {
    console.error('Failed to send message:', error);
  }
};



    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true); // Always open sidebar on larger screens
            } else {
                // If resizing from large to small, and sidebar was open, close it.
                // If sidebar was already closed on small screen, keep it closed.
                if (isSidebarOpen) { // Only close if it's currently open
                    setIsSidebarOpen(false);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]); // Add isSidebarOpen to dependencies to re-evaluate on manual toggle


    const selectedContact = contacts.find(contact => contact.id === selectedContactId);

    const Icon = ({ name, size = 20, color = 'currentColor', className = '' }) => {
        // Default size for icons, can be overridden by className or specific size prop
        let defaultSize = 20; // Default for larger screens
        // For smaller screens, we'll use responsive classes where applicable

        switch (name) {
            case 'Menu':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width={size || defaultSize} height={size || defaultSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <line x1="4" y1="12" x2="20" y2="12"></line>
                        <line x1="4" y1="6" x2="20" y2="6"></line>
                        <line x1="4" y1="18" x2="20" y2="18"></line>
                    </svg>
                );
            case 'Search':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width={size || defaultSize} height={size || defaultSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                );
            case 'MoreHorizontal':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width={size || defaultSize} height={size || defaultSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                );
            case 'Plus':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width={size || defaultSize} height={size || defaultSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                );
            case 'Send':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width={size || defaultSize} height={size || defaultSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                );
            case 'Smile':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width={size || defaultSize} height={size || defaultSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                );
            case 'Paperclip':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width={size || defaultSize} height={size || defaultSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <path d="M21.44 11.02L13.02 2.6a2 2 0 0 0-2.83 0L3.6 9.19a2 2 0 0 0 0 2.83l8.42 8.42a2 2 0 0 0 2.83 0l7.82-7.82a2 2 0 0 0 0-2.83z"></path>
                    </svg>
                );
            default:
                return null;
        }
    };
    const handleSendMessage = async () => {
        if (newMessage.trim()) {
          const messageToSend = newMessage.trim();
          setNewMessage('');
      
          try {
            const response = await fetch('http://localhost:8000/chat/send', {
              method: 'POST',
              withCredentials: true, // correct usage for sending cookies/session
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${driverToken}`,
              },
              body: JSON.stringify({
                receiver_id: selectedContactId,
                sender_id: userId,
                message: messageToSend,
                sender_type: 'user',
                receiver_type: 'driver',
              }),
            });
            
      
            const data = await response.json();
      
            if (data.success && data.data) {
              const msg = data.data;
              const formattedMessage = {
                id: msg.id,
                text: msg.message,
                time: new Date(msg.created_at).toLocaleTimeString(),
                isMe: msg.sender_id === userId,
                senderId: msg.sender_id,
                senderRole: msg.sender_type, // Ensure this is passed

              };
              setMessages(prev => [...prev, formattedMessage]);
            } else {
              console.error('Message send failed: ', data);
            }
          } catch (error) {
            console.error('Failed to send message:', error);
          }
        }
      };
      const getAllMessages =async()=>{
        axios.get(`http://localhost:8000/driver/messages`,{withCredentials:true}, {
          headers: {
            Authorization: `Bearer ${driverToken}`,
          }
        })
        .then((res) => {
          const allMessages = Array.isArray(res.data.data) ? res.data.data : [];
      
          console.log("All Messages:", allMessages); // Debug
      
          const uniqueSenders = {};
          allMessages.forEach((msg) => {
            const senderId = msg.receiver_id;
            if (!uniqueSenders[senderId]) {
              uniqueSenders[senderId] = {
                id: senderId,
                name: msg.receiver_name,
                avatar: msg.receiver_avatar,
                lastMessage: msg.message,
                time: formatTime(msg.created_at),
                unread: 0,  // or use real count if you have it
                status: 'online', // fake status for now if needed
              };
            }
          });
      
          const contactsList = Object.values(uniqueSenders);
          console.log("Contacts:", contactsList);
      
          setContacts(contactsList);
        })
        .catch((err) => {
          console.error("Failed to fetch messages:", err);
        });
      };
      useEffect(() => {
        axios.get(`http://localhost:8000/driver/messages`,{withCredentials:true}, {
          headers: {
            Authorization: `Bearer ${driverToken}`,
          }
        })
        .then((res) => {
          const allMessages = Array.isArray(res.data.data) ? res.data.data : [];
      
          console.log("All Messages:", allMessages); // Debug
      
          const uniqueSenders = {};
          allMessages.forEach((msg) => {
            const senderId = msg.receiver_id;
            if (!uniqueSenders[senderId]) {
              uniqueSenders[senderId] = {
                id: senderId,
                name: msg.receiver_name,
                avatar: msg.receiver_avatar,
                lastMessage: msg.message,
                time: formatTime(msg.created_at),
                unread: 0,  // or use real count if you have it
                status: 'online', // fake status for now if needed
              };
            }
          });
      
          const contactsList = Object.values(uniqueSenders);
          console.log("Contacts:", contactsList);
      
          setContacts(contactsList);
        })
        .catch((err) => {
          console.error("Failed to fetch messages:", err);
        });
      }, []);
      
      const handleContactClick = async (contactId) => {
        setSelectedContactId(contactId);
        console.log(userId, contactId);
      
        try {
          const res = await axios.get(
            `http://localhost:8000/chat/admin/${contactId}`,
            {
              params: { customer_id: userId },
              headers: { Authorization: `Bearer ${driverToken}` },
            },{ withCredentials: true },
          );
      
          let msgs = res.data.messages || [];
      
          // ✅ If no messages, send initial "hello" from me
          if (msgs.length === 0) {
            const defaultMessage = "Hello from me 👋";
      
            const sendRes = await axios.post(
              `http://localhost:8000/chat/send`,
              {
                sender_id: userId,
                receiver_id: contactId,
                sender_type: 'customer',  // or your appropriate type
                message: defaultMessage,
              },{ withCredentials: true },
              {
                headers: { Authorization: `Bearer ${driverToken}` },
              }
            );
      
            // Add sent message to messages list
            msgs = [
              {
                id: sendRes.data.message.id,
                message: defaultMessage,
                created_at: sendRes.data.message.created_at,
                sender_id: userId,
                receiver_id: contactId,
                sender_type: 'customer',
              },
            ];
          }
      
          // Format messages
          const formatted = msgs.map(msg => ({
            id: msg.id,
            text: msg.message,
            time: new Date(msg.created_at).toLocaleTimeString(),
            isMe: msg.sender_id === userId,
            senderId: msg.sender_id,
            receiverId: msg.receiver_id,
            senderRole: msg.sender_type,
          }));
      
          setMessages(formatted);
        } catch (err) {
          console.error("Error loading messages:", err);
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
                className={`fixed top-0 left-0 h-full bg-white shadow-md md:mt-2 md:ml-2 z-30 transition-transform duration-300 ease-in-out
                            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                            md:relative md:translate-x-0 md:flex md:w-1/3 lg:w-1/4 xl:w-1/5 md:min-w-[280px] md:shadow-none
                            w-full max-w-[280px] sm:max-w-[320px] flex-col flex`}
                style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', borderRightWidth: '1px' }}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: '#E2E8F0' }}> {/* Reduced padding */}
                    <h2 className="text-lg md:text-xl font-semibold" style={{ color: '#1A202C' }}>Inbox</h2> {/* Responsive font size */}
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#D1FAE5', color: '#047857' }}> {/* Reduced padding */}
                        3 New
                    </span>
                    {/* Menu icon to close sidebar on mobile */}
                    <button onClick={toggleSidebar} className="md:hidden p-0.5 rounded-md hover:bg-gray-100"> {/* Reduced padding */}
                        <Icon name="Menu" size={18} color='#A0AEC0' /> {/* Smaller icon size */}
                    </button>
                </div>

                {/* Sidebar Search Input */}
                <div className="p-3 border-b" style={{ borderColor: '#E2E8F0' }}> {/* Reduced padding */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 text-sm" 
                            style={{ backgroundColor: '#F8FAFC', borderColor: '#CBD5E0', color: '#1A202C', outlineColor: '#38A169' }}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2"> {/* Reduced padding */}
                            <Icon name="Search" size={16} color='#A0AEC0' /> {/* Smaller search icon */}
                        </div>
                    </div>
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 110px)' }}> {/* Adjusted max-height based on header/search input */}
                {contacts.map((contact) => (
   <div
   key={contact.id}
   onClick={() => handleContactClick(contact.id)}
   className="cursor-pointer hover:bg-gray-100 transition flex items-center justify-between p-2 border-b"
 >
    <div className="flex items-center space-x-2 rtl:space-x-reverse min-w-0 flex-1">
      <div className="relative flex-shrink-0">
        <img src={contact.avatar} alt={contact.name} className="w-9 h-9 rounded-full" />
        {contact.status === 'online' && (
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#38A169', border: '1px solid #FFFFFF' }}></span>
        )}
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="font-medium truncate text-sm" style={{ color: '#1A202C' }}>{contact.name}</p>
        <p className="text-xs truncate" style={{ color: '#6B7280' }}>{contact.lastMessage}</p>
      </div>
    </div>
    <div className="text-right flex-shrink-0 ml-1">
      <p className="text-xs" style={{ color: '#A0AEC0' }}>{contact.time}</p>
      {contact.unread > 0 && (
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-bold mt-0.5"
          style={{ backgroundColor: '#38A169', color: '#FFFFFF' }}>
          {contact.unread}
        </span>
      )}
    </div>
  </div>
))}


                </div>
            </div>

            {/* Chat Area Section */}
            {/* Conditional display for mobile to hide chat when sidebar is open */}
            <div className={`flex flex-col flex-1 min-w-0 ${isSidebarOpen && window.innerWidth < 768 ? 'hidden' : 'flex'}`}>
                {/* Chat Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}> {/* Reduced padding */}
                    <button onClick={toggleSidebar} className="md:hidden p-0.5 rounded-md hover:bg-gray-100 flex-shrink-0">
                        <Icon name="Menu" size={20} /> {/* Smaller menu icon here */}
                    </button>
                    {selectedContact && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse flex-1 ml-2 md:ml-0 min-w-0"> {/* Reduced space-x, added min-w-0 */}
                            <div className="relative flex-shrink-0">
                                <img src={selectedContact.avatar} alt={selectedContact.name} className="w-9 h-9 rounded-full" /> {/* Smaller avatar */}
                                {selectedContact.status === 'online' && (
                                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full" style={{ backgroundColor: '#38A169', border: '1px solid #FFFFFF' }}></span> 
                                )}
                            </div>
                            <div className="min-w-0 overflow-hidden">
                                <p className="font-semibold text-sm truncate" style={{ color: '#1A202C' }}>{selectedContact.name}</p> {/* Smaller font size */}
                                <p className="text-xs truncate" style={{ color: '#4A5568' }}>{selectedContact.status === 'online' ? 'Online' : 'Offline'}</p> {/* Smaller font size */}
                            </div>
                        </div>
                    )}
                    <Icon name="MoreHorizontal" size={20} color='#A0AEC0' className="flex-shrink-0" /> {/* Smaller icon */}
                </div>

                {/* Messages Display */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3" style={{ backgroundColor: '#F8FAFC', maxHeight: 'calc(100vh - 100px)' }}>
  {messages.length === 0 ? (
    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
      ابدأ المحادثة...
    </div>
  ) : (
    messages.map((message) => {
      const isDriver = message.senderRole === 'driver';
      const isMe = message.senderId === userId;

      const showOnLeft = isDriver; // Driver's messages on the left
      const avatar = contacts.find(c => c.id === message.senderId)?.avatar || 'https://placehold.co/30x30/E2E8F0/A0AEC0?text=D';

      return (
        <div
          key={message.id}
          className={`flex ${showOnLeft ? 'justify-start' : 'justify-end'}`}
        >
          {showOnLeft && (
            <img
              src={avatar}
              alt="Sender Avatar"
              className="w-7 h-7 rounded-full mr-1.5 rtl:mr-0 rtl:ml-1.5 flex-shrink-0"
            />
          )}
          <div
            className={`max-w-[80%] p-2 rounded-lg shadow-sm ${showOnLeft
              ? 'text-gray-900 bg-white'
              : 'text-white bg-blue-500'
              }`}
          >
            <p className="text-sm break-words">{message.text}</p>
            <p className="text-[10px] text-right mt-0.5" style={{ color: showOnLeft ? '#A0AEC0' : '#E2E8F0' }}>{message.time}</p>
          </div>
          {!showOnLeft && (
            <img
              src={'https://placehold.co/30x30/E2E8F0/A0AEC0?text=U'}
              alt="My Avatar"
              className="w-7 h-7 rounded-full ml-1.5 rtl:ml-0 rtl:mr-1.5 flex-shrink-0"
            />
          )}
        </div>
      );
    })
  )}
  <div ref={messagesEndRef} />
</div>



                {/* Message Input Area */}
                <div className="p-2 border-t flex items-center space-x-1.5 rtl:space-x-reverse" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}> {/* Reduced padding, space-x */}
                    <Icon name="Plus" size={18} color='#A0AEC0' className="flex-shrink-0" /> {/* Smaller icons */}
                    <Icon name="Smile" size={18} color='#A0AEC0' className="flex-shrink-0" />
                    <Icon name="Paperclip" size={18} color='#A0AEC0' className="flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Write a message..."
                        className="flex-1 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 text-sm" 
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
                        className="p-1.5 rounded-full flex items-center justify-center flex-shrink-0" // Reduced padding
                        style={{ backgroundColor: '#4299E1', color: '#FFFFFF' }}
                        onClick={handleSendMessage}>
                        <Icon name="Send" size={18} /> {/* Smaller send icon */}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;