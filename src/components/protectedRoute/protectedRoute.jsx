import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/userSlice';
import { setSelectedChat } from '../../store/chatSlice';
import { getloguser } from "../../services/apicalls/user"

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  useEffect(() => {
    console.log("ProtectedRoute mounted, currentUser:", currentUser);
    
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token ? "exists" : "missing");
    
    if (!token) {
      console.log("No token, redirecting to signin");
      navigate("/");
      return;
    }

    // If user data is already in Redux store, just restore chat state
    if (currentUser && currentUser._id) {
      console.log("User already in Redux, restoring chat state");
      restoreChatState();
      return;
    }

    // Try to load user from localStorage first
    const savedUser = localStorage.getItem("user");
    console.log("Saved user from localStorage:", savedUser ? "exists" : "missing");
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log("Parsed user data:", userData);
        if (userData._id) {
          dispatch(login(userData));
          restoreChatState();
          return;
        }
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }

    // If no saved user data, fetch from API
    console.log("Fetching user data from API...");
    getloguser().then((res) => {
      console.log("API response:", res);
      if (res && res.ok && res.user) {
        console.log("API call successful, dispatching login");
        // Dispatch user data to Redux store
        dispatch(login(res.user));
        restoreChatState();
      } else {
        console.error("Failed to get user data:", res?.error || "Invalid response");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    }).catch((error) => {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    });
  }, [dispatch, navigate, currentUser]);

  const restoreChatState = () => {
    console.log("Restoring chat state...");
    // Restore selected chat from localStorage if exists
    const savedChat = localStorage.getItem("selectedChat");
    if (savedChat) {
      try {
        const chatData = JSON.parse(savedChat);
        console.log("Restoring chat:", chatData);
        dispatch(setSelectedChat(chatData));
      } catch (error) {
        console.error("Error parsing saved chat:", error);
        localStorage.removeItem("selectedChat");
      }
    }
  };

  return <>{children}</>;
}

export default ProtectedRoute;
