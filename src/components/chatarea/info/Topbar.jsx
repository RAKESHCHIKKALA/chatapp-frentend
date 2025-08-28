import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearChat } from '../../../store/chatSlice';
import toast from 'react-hot-toast';
import './Topbar.css';

const Topbar = () => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const currentUser = useSelector((state) => state.user.user);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    console.log(`Selected option: ${option}`);
    setShowMenu(false);
    
    switch (option) {
      case 'view-profile':
        handleViewProfile();
        break;
      case 'block':
        handleBlockUser();
        break;
      case 'report':
        handleReportUser();
        break;
      case 'clear-chat':
        handleClearChat();
        break;
      default:
        break;
    }
  };

  const handleViewProfile = () => {
    toast.success(`Viewing ${selectedChat.name}'s profile`);
    // Add profile view logic here
  };

  const handleBlockUser = () => {
    toast.success(`Blocked ${selectedChat.name}`);
    // Add block user logic here
  };

  const handleReportUser = () => {
    toast.success(`Reported ${selectedChat.name}`);
    // Add report user logic here
  };

  const handleClearChat = () => {
    if (window.confirm(`Are you sure you want to clear chat with ${selectedChat.name}?`)) {
      dispatch(clearChat());
      toast.success('Chat cleared successfully');
    }
  };

  if (!selectedChat) {
    return (
      <div className="topbar">
        <div className="chat-info">
          <h3>Select a chat to start messaging</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="topbar">
      <div className="chat-info">
        <img
          src="https://tse1.mm.bing.net/th/id/OIP.GHGGLYe7gDfZUzF_tElxiQHaHa?pid=Api&P=0&h=180"
          alt="Profile"
          width={40}
          height={40}
          className="chat-avatar"
        />
        <div className="chat-details">
          <h3>{selectedChat.name || selectedChat.userName || 'Unknown User'}</h3>
          <span className="chat-status">
            <span className="status-dot offline"></span>
            Offline
          </span>
        </div>
      </div>
      
      <div className="chat-actions">
        <div className="menu-container" ref={menuRef}>
          <button 
            className="menu-btn"
            onClick={toggleMenu}
            title="More options"
          >
            ⋮
          </button>
          
          {showMenu && (
            <div className="dropdown-menu">
              <div className="menu-item" onClick={() => handleOptionClick('view-profile')}>
                👤 View Profile
              </div>
              <div className="menu-item" onClick={() => handleOptionClick('block')}>
                🚫 Block User
              </div>
              <div className="menu-item" onClick={() => handleOptionClick('report')}>
                🚩 Report
              </div>
              <div className="menu-item" onClick={() => handleOptionClick('clear-chat')}>
                🗑️ Clear Chat
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;








