import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateMessage, deleteMessage } from '../../../store/chatSlice';
import './Message.css';

const Message = ({ message, isOwnMessage }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.message);
  const [showTimeTooltip, setShowTimeTooltip] = useState(false);
  const editInputRef = useRef(null);
  const optionsRef = useRef(null);

  const isWithin4Hours = () => {
    const messageTime = new Date(message.timestamp);
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    return messageTime > fourHoursAgo;
  };

  const canEditDelete = isOwnMessage && isWithin4Hours();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = async () => {
    if (editText.trim() === message.message) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5409/messages/edit/${message._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newMessage: editText.trim(),
          userId: currentUser._id
        }),
      });

      if (response.ok) {
        dispatch(updateMessage({
          messageId: message._id,
          newMessage: editText.trim()
        }));
        setIsEditing(false);
        setShowOptions(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to edit message');
      }
    } catch (error) {
      console.error('Error editing message:', error);
      alert('Failed to edit message');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`http://localhost:5409/messages/delete/${message._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id }),
      });

      if (response.ok) {
        dispatch(deleteMessage(message._id));
        setShowOptions(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (message.isDeleted) {
    return (
      <div className={`message ${isOwnMessage ? 'mine' : 'other'} deleted`}>
        <div className="message-content">
          <span className="deleted-text">This message was deleted</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`message ${isOwnMessage ? 'mine' : 'other'}`}>
      <div className="message-content">
        {isEditing ? (
          <div className="edit-container">
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEdit();
                } else if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditText(message.message);
                }
              }}
            />
            <div className="edit-actions">
              <button onClick={handleEdit} className="save-btn">Save</button>
              <button onClick={() => {
                setIsEditing(false);
                setEditText(message.message);
              }} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="message-text">
              {message.message}
              {message.isEdited && <span className="edited-indicator"> (edited)</span>}
            </div>
            {message.fileUrl && (
              <div className="message-file">
                <a href={`http://localhost:5409${message.fileUrl}`} target="_blank" rel="noopener noreferrer">
                  📎 Attachment
                </a>
              </div>
            )}
            <div 
              className="message-time"
              onMouseEnter={() => setShowTimeTooltip(true)}
              onMouseLeave={() => setShowTimeTooltip(false)}
            >
              {formatTime(message.timestamp)}
              {showTimeTooltip && (
                <div className="time-tooltip">
                  {formatDate(message.timestamp)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {canEditDelete && !isEditing && (
        <div className="message-options" ref={optionsRef}>
          <button 
            className="options-btn"
            onClick={() => setShowOptions(!showOptions)}
          >
            ⋮
          </button>
          {showOptions && (
            <div className="options-menu">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
