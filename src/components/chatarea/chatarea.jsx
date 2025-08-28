import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./chatarea.css";
import Topbar from "./info/Topbar";
import Message from "./msg/Message";
import {
  addMessage,
  setMessages,
  addTypingUser,
  removeTypingUser,
} from "../../store/chatSlice";
import toast from "react-hot-toast";

const Chatarea = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [file, setFile] = useState(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const currentUser = useSelector((state) => state.user.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const messages = useSelector((state) => state.chat.messages);
  const typingUsers = useSelector((state) => state.chat.typingUsers);

  // ✅ Initialize Socket.IO
  useEffect(() => {
    const newSocket = io("http://localhost:5409");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("receive_message", (data) => {
      dispatch(addMessage(data));
    });

    newSocket.on("user_typing", (data) => {
      if (data.userId !== currentUser?._id) {
        dispatch(addTypingUser(data));
      }
    });

    newSocket.on("user_stop_typing", (data) => {
      if (data.userId !== currentUser?._id) {
        dispatch(removeTypingUser(data.userId));
      }
    });

    return () => {
      newSocket.close();
    };
  }, [dispatch, currentUser?._id]);

  // ✅ Join chat room
  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit("join_room", selectedChat._id);
      fetchMessages();
      // Clear message input when switching chats
      setMessage("");
      setFile(null);
      // Focus on the textarea when chat is selected
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [socket, selectedChat]);

  // ✅ Scroll down
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll events to show/hide scroll to bottom button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      console.log('Scroll info:', { scrollTop, scrollHeight, clientHeight });
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Force scroll to bottom when messages change
  const scrollToBottom = () => {
    console.log('Scrolling to bottom...');
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      console.log("Fetching messages for chat:", selectedChat._id);
      const response = await fetch(
        `http://localhost:5409/messages/chat/${selectedChat._id}`
      );
      const data = await response.json();
      console.log("Fetch messages response:", data);

      if (data.ok) {
        dispatch(setMessages(data.messages));
      } else {
        console.error("Failed to fetch messages:", data.error);
        toast.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Error fetching messages");
    }
  };

  // ✅ Pickers
  const handlePickImage = () => imageInputRef.current?.click();
  const handlePickFile = () => fileInputRef.current?.click();

  // ✅ Send Message (text or file)
  const handleSend = async () => {
    console.log('handleSend called with:', { message, file, selectedChat, currentUser });
    
    if ((!message.trim() && !file) || !selectedChat || !currentUser) {
      console.log('Validation failed:', { 
        hasMessage: !!message.trim(), 
        hasFile: !!file, 
        hasSelectedChat: !!selectedChat, 
        hasCurrentUser: !!currentUser 
      });
      return;
    }

    try {
      let formData;
      let headers = {};
      let body;

      if (file) {
        formData = new FormData();
        formData.append("chatId", selectedChat._id);
        formData.append("senderId", currentUser._id);
        formData.append("senderName", currentUser.name);
        if (message) formData.append("message", message);
        formData.append("file", file);
        body = formData;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify({
          chatId: selectedChat._id,
          senderId: currentUser._id,
          senderName: currentUser.name,
          message,
        });
      }

      const response = await fetch("http://localhost:5409/messages/send", {
        method: "POST",
        headers,
        body,
      });

      const data = await response.json();

      if (data.ok) {
        dispatch(addMessage(data.message));
        socket?.emit("send_message", data.message);
        setMessage("");
        setFile(null);

        if (isTyping) {
          setIsTyping(false);
          socket?.emit("stop_typing", {
            chatId: selectedChat._id,
            userId: currentUser._id,
          });
        }
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  // ✅ Handle file select
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  // ✅ Typing indicator
  const handleTyping = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (!isTyping) {
      setIsTyping(true);
      socket?.emit("typing", {
        chatId: selectedChat._id,
        userId: currentUser._id,
        userName: currentUser.name,
      });
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const newTimeout = setTimeout(() => {
      setIsTyping(false);
      socket?.emit("stop_typing", {
        chatId: selectedChat._id,
        userId: currentUser._id,
      });
    }, 1000);

    setTypingTimeout(newTimeout);
  };

  if (!selectedChat) {
    return (
      <div className="chatarea">
        <Topbar />
        <div className="messages-placeholder">
          <div className="no-chat-selected">
            <i className="bi bi-chat-dots"></i>
            <h3>Select a chat to start messaging</h3>
            <p>Choose a conversation from the sidebar to begin chatting</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chatarea">
      <Topbar />

      <div className="messages-container" ref={messagesContainerRef}>
        <div className="messages-list">
          {messages.map((msg) => (
            <Message
              key={msg._id}
              message={msg}
              isOwnMessage={msg.senderId === currentUser?._id}
            />
          ))}

          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">
                {typingUsers.map((u) => u.userName).join(", ")}{" "}
                {typingUsers.length === 1 ? "is" : "are"} typing...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollToBottom && (
          <button
            className="scroll-to-bottom-btn"
            onClick={scrollToBottom}
            title="Scroll to bottom"
          >
            <i className="bi bi-chevron-down"></i>
          </button>
        )}
      </div>

      <div className="composer">
        <div className="left-tools">
          <button
            className="icon-btn"
            title="Add emoji"
            onClick={() => setShowEmojis((v) => !v)}
          >
            <i className="bi bi-emoji-smile"></i>
          </button>
          <button
            className="icon-btn"
            title="Add image"
            onClick={handlePickImage}
          >
            <i className="bi bi-image"></i>
          </button>
          <button
            className="icon-btn"
            title="Attach file"
            onClick={handlePickFile}
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>

        <div className="input-wrap">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTyping}
            placeholder="Type a message"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>

        <button
          className="send-btn"
          title="Send"
          onClick={handleSend}
          disabled={!message.trim() && !file}
        >
          <i className="bi bi-send-fill"></i>
        </button>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {showEmojis && (
          <div className="emoji-panel">
            {"😀 😄 😍 😂 🤩 😎 🙌 👍 👀 🎉 💯 🚀 ❤️ 😊 😉 🤗 😇"
              .split(" ")
              .map((e, idx) => (
                <button
                  key={idx}
                  className="emoji-btn"
                  onClick={() => setMessage((prev) => prev + e)}
                >
                  {e}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatarea;
