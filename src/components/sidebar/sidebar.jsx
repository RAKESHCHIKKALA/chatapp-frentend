import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChat, clearChat } from '../../store/chatSlice';
import './sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const [chats, setChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = useSelector((state) => state.user.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem("userChats");
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
      } catch (error) {
        console.error("Error parsing saved chats:", error);
        localStorage.removeItem("userChats");
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser?._id) {
      fetchUserChats();
      fetchAllUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?._id && chats.length > 0) {
      fetchAllUsers();
    }
  }, [currentUser, chats]);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("userChats", JSON.stringify(chats));
    }
    console.log('Chats updated:', chats.length);
  }, [chats]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.mail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    console.log('Filtered users:', filteredUsers.length);
  }, [searchQuery, allUsers]);

  const fetchUserChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5409/chats/user/${currentUser._id}`);
      const data = await response.json();
      
      if (data.ok) {
        setChats(data.chats);
      } else {
        console.error('Failed to fetch chats:', data.error);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch(`http://localhost:5409/chats/users`);
      const data = await response.json();
      
      if (data.ok) {
        // Filter out current user only
        const availableUsers = data.users.filter(user => 
          user._id !== currentUser._id
        );
        
        setAllUsers(availableUsers);
        setFilteredUsers(availableUsers);
      } else {
        console.error('Failed to fetch users:', data.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChatSelect = (chat) => {
    dispatch(setSelectedChat(chat));
  };

  const handleStartChat = async (user) => {
    try {
      const response = await fetch('http://localhost:5409/chats/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId1: currentUser._id,
          userId2: user._id
        }),
      });

      const data = await response.json();
      
      if (data.ok) {
        // Create a temporary chat object for immediate display
        const newChat = {
          _id: data.chat._id,
          name: user.name || user.mail,
          userName: user.name || user.mail,
          lastMessage: 'No messages yet',
          lastMessageTime: null,
          unreadCount: 0,
          isOnline: false,
          members: data.chat.members
        };

        // Add to chats list
        setChats(prevChats => [...prevChats, newChat]);
        
        // Select the new chat
        dispatch(setSelectedChat(newChat));
        
        // Refresh users list
        fetchAllUsers();
      } else {
        console.error('Failed to create chat:', data.error);
        alert('Failed to create chat: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      alert('Error creating chat. Please try again.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="sidebar">
        <div className="loading-chats">
          <div className="loading-spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar">
      {/* Fixed Search Container */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="scrollable-content">
        {/* Existing Chats Section */}
        <div className="chats-section">
          <h4 className="section-title">Your Chats</h4>
          <div className="chats-list">
            {chats.length === 0 ? (
              <div className="no-chats">
                <i className="bi bi-chat-dots"></i>
                <h3>No chats yet</h3>
                <p>Start a conversation with someone to see your chats here</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div 
                  key={chat._id} 
                  className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="chat-avatar">
                    <img
                      src="https://tse1.mm.bing.net/th/id/OIP.GHGGLYe7gDfZUzF_tElxiQHaHa?pid=Api&P=0&h=180"
                      alt="Profile"
                      width={40}
                      height={40}
                    />
                  </div>
                  
                  <div className="chat-info">
                    <div className="chat-name">
                      {chat.name || chat.userName || 'Unknown Chat'}
                    </div>
                    <div className="chat-last-message">
                      {chat.lastMessage || 'No messages yet'}
                    </div>
                  </div>
                  
                  {chat.unreadCount > 0 && (
                    <div className="unread-badge">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              ))
            )}
            {loadingUsers ? (
              <div className="loading-users">
                <div className="loading-spinner"></div>
                <span>Loading users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="no-users">
                <i className="bi bi-search"></i>
                <h3>{searchQuery ? 'No users found' : 'No users available'}</h3>
                <p>{searchQuery ? 'Try a different search term' : 'No users in the database'}</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user._id} className="user-item">
                  <div className="user-avatar">
                    <img
                      src="https://tse1.mm.bing.net/th/id/OIP.GHGGLYe7gDfZUzF_tElxiQHaHa?pid=Api&P=0&h=180"
                      alt="Profile"
                      width={40}
                      height={40}
                    />
                  </div>
                  
                  <div className="user-info">
                    <div className="user-name">
                      {user.name || user.mail || 'Unknown User'}
                    </div>
                    <div className="user-email">
                      {user.mail}
                    </div>
                    {user.phone && (
                      <div className="user-phone">
                        📞 {user.phone}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="start-chat-btn-small"
                    onClick={() => handleStartChat(user)}
                    title="Start chat"
                  >
                    <i className="bi bi-chat-dots"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
    </div>  
  </div>
  );
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays > 1) {
    return date.toLocaleDateString();
  } else {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};

export default Sidebar;
