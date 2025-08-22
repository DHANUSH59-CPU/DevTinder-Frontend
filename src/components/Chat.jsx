import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const fetchChatMessages = async () => {
    if (!targetUserId) {
      console.error("No target user ID provided");
      return;
    }

    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages =
        chat?.data?.messages?.map((msg) => {
          const { senderId, text } = msg;
          return {
            firstName: senderId?.firstName || "Unknown",
            lastName: senderId?.lastName || "User",
            text: text || "",
          };
        }) || [];

      setMessages(chatMessages);
    } catch (err) {
      console.error("Error fetching chat messages:", err);
      setMessages([]); // Set empty messages on error
    }
  };
  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId || !user) {
      return;
    }
    const socket = createSocketConnection();

    // As soon as the page loaded, the socket connection is made and joinChat event is emitted
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { firstName, lastName, text },
      ]);
    });

    socket.on("messageError", ({ error }) => {
      setError(error);
      setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
    });

    // Store socket in ref for sendMessage to use
    window.chatSocket = socket;

    return () => {
      socket.disconnect();
      window.chatSocket = null;
    };
  }, [userId, targetUserId, user]);

  // Early return if no user data - AFTER all hooks
  if (!user) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  const sendMessage = () => {
    if (!window.chatSocket || !newMessage.trim() || !user) {
      return;
    }

    if (newMessage.length > 1000) {
      setError("Message too long (max 1000 characters)");
      setTimeout(() => setError(null), 5000);
      return;
    }

    window.chatSocket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage.trim(),
    });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mt-7 mx-auto bg-black text-white rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Chat Header */}
      <div className="flex items-center p-4 bg-black border-b border-gray-800 shadow-lg">
        <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 hover:scale-110 hover:bg-purple-500 cursor-pointer">
          {user?.firstName?.charAt(0) || "U"}
        </div>
        <div className="ml-3 flex-1">
          <h2 className="font-semibold text-white">Chat</h2>
          <p className="text-sm text-purple-200">Online</p>
        </div>
        <div className="flex space-x-3">
          <button className="p-2 hover:bg-purple-700 rounded-full transition-all duration-300 hover:scale-110 active:scale-95">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-purple-700 rounded-full transition-all duration-300 hover:scale-110 active:scale-95">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-purple-700 rounded-full transition-all duration-300 hover:scale-110 active:scale-95">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/80 border border-red-500/30 text-red-300 px-4 py-2 mx-4 mt-2 rounded-lg backdrop-blur-md">
          {error}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
        {messages.map((msg, index) => {
          const isCurrentUser = user.firstName === msg.firstName;
          return (
            <div
              key={index}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              } animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-sm lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md border transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isCurrentUser
                    ? "bg-purple-900/60 text-white rounded-br-md border-purple-500/30 hover:bg-purple-800/70 hover:border-purple-400/50"
                    : "bg-indigo-900/60 text-gray-100 rounded-bl-md border-indigo-500/30 hover:bg-indigo-800/70 hover:border-indigo-400/50"
                }`}
              >
                {!isCurrentUser && (
                  <p className="text-xs font-semibold text-purple-300 mb-1">
                    {`${msg.firstName} ${msg.lastName}`}
                  </p>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    isCurrentUser ? "text-purple-300" : "text-indigo-300"
                  }`}
                >
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-black border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-gray-900 rounded-full px-4 py-2 transition-all duration-300 focus-within:bg-gray-800 focus-within:ring-2 focus-within:ring-purple-500/30">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="w-full bg-transparent text-white placeholder-gray-400 outline-none transition-all duration-300"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-all duration-300 shadow-lg hover:scale-110 hover:shadow-xl active:scale-95"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
export default Chat;
