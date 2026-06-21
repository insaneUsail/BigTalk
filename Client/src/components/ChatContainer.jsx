import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../library/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();
  const fileInputRef = useRef();

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const { messages, getMessages, sendMessage } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    await sendMessage(selectedUser._id, {
  text: input.trim(),
  image: selectedImage,
});

    setInput("");
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          className="w-10 h-10 rounded-full object-cover"
          alt=""
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser?.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="top-5 w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden max-w-7 cursor-pointer"
          alt=""
        />

        <img src={assets.help_icon} className="max-md:hidden max-w-5" alt="" />
      </div>

      {/* Chat messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-5">
            No messages yet. Start the conversation.
          </p>
        )}

        {messages.map((msg) => {
          const isMine = msg.senderId === authUser?._id;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                  alt=""
                />
              ) : (
                <p
                  className={`p-2 max-w-[220px] md:text-sm font-light rounded-lg mb-8 break-all text-white ${
                    isMine
                      ? "bg-violet-500/30 rounded-br-none"
                      : "bg-gray-500/30 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <div className="text-center text-xs">
                <img
                  src={
                    isMine
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  className="w-7 h-7 rounded-full object-cover"
                  alt=""
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={scrollEnd}></div>
      </div>

      {/* Selected image preview */}
      {selectedImage && (
        <div className="absolute bottom-16 left-3">
          <img
            src={selectedImage}
            className="w-20 h-20 object-cover rounded-lg border border-gray-500"
            alt=""
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="text-xs text-white bg-red-500 px-2 py-1 rounded mt-1"
          >
            Remove
          </button>
        </div>
      )}

      {/* Bottom input area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
          />

          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              className="w-5 mr-3 cursor-pointer"
              alt=""
            />
          </label>
        </div>

        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          className="w-7 cursor-pointer"
          alt=""
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;