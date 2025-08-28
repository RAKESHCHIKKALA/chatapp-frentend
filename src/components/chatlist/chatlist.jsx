import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import "./chatlist.css"
import Userchat from '../userchat/userchat'
import axios from 'axios'

const chatlist = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [existingChats, setExistingChats] = useState([]);
  const currentUser = useSelector((state) => state.user.user);

  // Fetch all users and existing chats
  useEffect(() => {
    const fetchUsersAndChats = async () => {
      try {
        setLoading(true);
        
        // Fetch all users
        const usersResponse = await axios.get('http://localhost:5409/chats/users');
        const allUsers = usersResponse.data.users || [];
        
        // Filter out current user
        const filteredUsers = allUsers.filter(user => user._id !== currentUser?._id);
        
        // Fetch existing chats for current user
        const chatsResponse = await axios.get('http://localhost:5409/chats/getuserchats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        const userChats = chatsResponse.data.data || [];
        setExistingChats(userChats);
        setUsers(filteredUsers);
        
      } catch (error) {
        console.error('Error fetching users and chats:', error);
        // Fallback to hardcoded users if API fails
        setUsers([
          {
            _id: "688c8e37a180f74942e8d92e",
            name: "rakesh chikkala",
            mail: "rakesh@gmail.com",
            phone: "9493996309"
          },
          {
            _id: "68919905ac151e847ac86398", 
            name: "rushma chikkala",
            mail: "rushma@gmail.com",
            phone: "9493996309"
          },
          {
            _id: "6891a0eb4fd00d60a672e74f",
            name: "newton",
            mail: "newton@gmail.com", 
            phone: "9490861216"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUsersAndChats();
    }
  }, [currentUser]);

  // Check if user has existing chat
  const hasExistingChat = (userId) => {
    return existingChats.some(chat => 
      chat.members && chat.members.some(member => 
        member === userId || member._id === userId
      )
    );
  };

  return (
    <div className="chatlist-container">
      <div className="chatlist-header">
        <p>YOUR CHATS</p>
        <span className="chat-count">{users.length} conversations</span>
      </div>
      <div className="chatlist-list">
        {loading ? (
          <div className="loading-message">Loading users...</div>
        ) : (
          users.map((user) => (
            <Userchat
              key={user._id}
              id={user._id}
              username={user.name}
              email={user.mail}
              phone={user.phone}
              hasExistingChat={hasExistingChat(user._id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default chatlist
