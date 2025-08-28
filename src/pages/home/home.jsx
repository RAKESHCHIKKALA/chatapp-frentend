import React, { useEffect } from 'react'
import "./home.css"
import Header from '../../components/header/header'
import Sidebar from '../../components/sidebar/sidebar'
import Chatarea from '../../components/chatarea/chatarea'
import Profile from '../../components/profile/Profile'
import { useSelector } from 'react-redux'

const Home = () => {
  const showProfile = useSelector((state) => state.profile.showProfile);

  // Test server connection on component mount
  useEffect(() => {
    const testServer = async () => {
      try {
        const response = await fetch('http://localhost:5409/test');
        const data = await response.json();
        console.log('Server test response:', data);
      } catch (error) {
        console.error('Server test failed:', error);
      }
    };
    
    testServer();
  }, []);

  return (
    <div className='home'>
      <Header/>
      <div className='bottomrow'>
        <Sidebar/>
        <Chatarea/>
      </div>
      {showProfile && <Profile />}
    </div>
  )
}

export default Home
