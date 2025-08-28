import {useState} from 'react'
import { useDispatch } from 'react-redux'
import "./userchat.css"
import {createchat} from "../../services/apicalls/chats"
import { setSelectedChat } from '../../store/chatSlice'

const Userchat = ({id, username, email, phone, hasExistingChat}) => {
    const[startchat ,setStartchat]=useState(hasExistingChat);
    const dispatch = useDispatch();
    const handleImageError = (e) => {
    e.target.src = "https://picsum.photos/57/57?random=999"; // Fallback image
  };
  const startChat=async()=>{
    try{
      console.log("Starting chat with user ID:", id);
      console.log("Token from localStorage:", localStorage.getItem("token"));
      
      var res= await createchat({id:id})
      console.log("Chat creation response:", res.data);
      
      if(res.data.ok){
        setStartchat(true);
        // Set the selected chat after creating it
        const chatData = {
          _id: res.data.result.insertedId || id, // Use user ID as fallback
          name: username,
          userName: username,
          members: [id]
        };
        console.log("Setting selected chat:", chatData);
        dispatch(setSelectedChat(chatData));
      }else{
         throw Error("failed chart to start")
    }
    }catch(error){
        console.error("Chat creation error:", error);
        alert("failed to sytart chat");
    }
  };

  // Handle clicking on existing chat
  const handleChatClick = () => {
    if (hasExistingChat || startchat) {
      const chatData = {
        _id: id,
        name: username,
        userName: username,
        members: [id]
      };
      dispatch(setSelectedChat(chatData));
    }
  };
  return (
    <div className='userchat' onClick={handleChatClick}>
        <div className='userimage'>
             <img 
               src="https://picsum.photos/57/57?random=999"
               alt={username}
               onError={handleImageError}
               width={57} 
               height={57}
             />
        </div>
         <div className='userdetails'>
        <h4>{username}</h4>
        <span>{email}</span>
        </div>
         <div className='startchat'>
            {
               !hasExistingChat && !startchat && id ? (
                 <button onClick={(e) => {
                   e.stopPropagation();
                   startChat();
                 }}>start</button>
               ) : null
            }
         </div>
    </div>
  )
}

Userchat.defaultProps = {
  username: "Unknown User",
  email: "No email",
  phone: "No phone"
};

export default Userchat
