import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { closeProfile } from '../../store/profileslice';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log('Profile component - user from Redux:', user);

  useEffect(() => {
    if (user?._id) {
      console.log('Fetching profile for user ID:', user._id);
      fetchUserProfile();
    } else {
      console.warn('User ID not available in Redux state');
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user?._id) {
      console.error('Cannot fetch profile: User ID not available');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5409/users/profile/${user._id}`);
      const data = await response.json();
      
      if (data.ok) {
        setUserInfo(data.user);
      } else {
        console.error('Failed to fetch user profile:', data.error);
        setUserInfo(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeProfile());
  };

  if (loading) {
    return (
      <div className="profile-overlay" onClick={handleClose}>
        <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
          <div className="profile-content">
            <div className="loading">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-overlay" onClick={handleClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-content">
          <div className="profile-header">
            <h2>User Profile</h2>
            <button className="close-btn" onClick={handleClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          
          <div className="profile-body">
            {userInfo ? (
              <>
                <div className="profile-avatar">
                  <img
                    src="https://tse1.mm.bing.net/th/id/OIP.GHGGLYe7gDfZUzF_tElxiQHaHa?pid=Api&P=0&h=180"
                    alt="Profile"
                    width={80}
                    height={80}
                  />
                </div>
                
                <div className="profile-info">
                  <div className="info-row">
                    <label>Name:</label>
                    <span>{userInfo.name}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Last Name:</label>
                    <span>{userInfo.lastName}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Gender:</label>
                    <span>{userInfo.gender || 'Not specified'}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Email:</label>
                    <span>{userInfo.mail}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Phone:</label>
                    <span>{userInfo.phone}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>User ID:</label>
                    <span>{userInfo._id}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-data">No user information available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
