import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChat: null,
  messages: [],
  typingUsers: [],
  onlineUsers: []
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
      // Save selected chat to localStorage for persistence
      if (action.payload) {
        localStorage.setItem("selectedChat", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("selectedChat");
      }
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const { messageId, newMessage } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg._id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex].message = newMessage;
        state.messages[messageIndex].isEdited = true;
        state.messages[messageIndex].lastEditedAt = new Date();
      }
    },
    deleteMessage: (state, action) => {
      const messageId = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg._id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex].isDeleted = true;
        state.messages[messageIndex].deletedAt = new Date();
      }
    },
    setTypingUsers: (state, action) => {
      state.typingUsers = action.payload;
    },
    addTypingUser: (state, action) => {
      const { userId, userName } = action.payload;
      const existingUser = state.typingUsers.find(user => user.userId === userId);
      if (!existingUser) {
        state.typingUsers.push({ userId, userName });
      }
    },
    removeTypingUser: (state, action) => {
      const userId = action.payload;
      state.typingUsers = state.typingUsers.filter(user => user.userId !== userId);
    },
    clearChat: (state) => {
      state.selectedChat = null;
      state.messages = [];
      state.typingUsers = [];
      localStorage.removeItem("selectedChat");
    }
  },
});

export const {
  setSelectedChat,
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  clearChat
} = chatSlice.actions;

export default chatSlice.reducer;





