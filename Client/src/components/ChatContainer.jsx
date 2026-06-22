import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../library/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = ({ selectedUser, setSelectedUser, setShowInfo }) => {
  const scrollEnd = useRef();
  const fileInputRef = useRef();

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const { messages, getMessages, sendMessage } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result);
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  if (!selectedUser) {
    return (
      <div className="hidden h-full flex-col items-center justify-center bg-[#0f172a]/50 px-6 text-center md:flex">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-500/10">
          <img src={assets.logo_icon} className="w-12" alt="" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">Welcome to BigTalk</h2>
        <p className="mt-2 max-w-sm text-sm text-gray-400">
          Select a conversation from the sidebar and start chatting instantly.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0f172a]/70">
      <header className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <button
          onClick={() => setSelectedUser(null)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 md:hidden"
        >
          <img src={assets.arrow_icon} className="w-5" alt="Back" />
        </button>

        <div className="relative">
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            className="h-11 w-11 rounded-full object-cover"
            alt={selectedUser.fullName}
          />
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f172a] ${
              isOnline ? "bg-emerald-400" : "bg-gray-500"
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{selectedUser.fullName}</p>
          <p className="text-xs text-gray-400">{isOnline ? "Online" : "Offline"}</p>
        </div>

        <button className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg hover:bg-white/10 sm:flex">
          📞
        </button>

        <button
          onClick={() => setShowInfo?.(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 lg:hidden"
        >
          ℹ️
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-3xl bg-white/5 p-5 text-4xl">👋</div>
            <h3 className="mt-4 text-lg font-bold">No messages yet</h3>
            <p className="mt-1 text-sm text-gray-400">Say hello to start the conversation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMine = msg.senderId === authUser?._id;

              return (
                <article
                  key={msg._id}
                  className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
                >
                  {!isMine && (
                    <img
                      src={selectedUser.profilePic || assets.avatar_icon}
                      className="h-8 w-8 rounded-full object-cover"
                      alt=""
                    />
                  )}

                  <div className={`max-w-[82%] sm:max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                    {msg.image ? (
                      <img
                        src={msg.image}
                        onClick={() => window.open(msg.image)}
                        className="max-h-72 max-w-full cursor-pointer rounded-2xl border border-white/10 object-cover"
                        alt="Shared"
                      />
                    ) : (
                      <p
                        className={`rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-lg ${
                          isMine
                            ? "rounded-br-md bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
                            : "rounded-bl-md bg-white/10 text-gray-100"
                        }`}
                      >
                        {msg.text}
                      </p>
                    )}

                    <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                      <span>{formatMessageTime(msg.createdAt)}</span>
                      {isMine && <span className={msg.seen ? "text-emerald-400" : "text-gray-500"}>{msg.seen ? "✓✓" : "✓"}</span>}
                    </div>
                  </div>
                </article>
              );
            })}
            <div ref={scrollEnd} />
          </div>
        )}
      </main>

      {selectedImage && (
        <div className="border-t border-white/10 px-4 py-2">
          <div className="relative w-fit">
            <img src={selectedImage} className="h-16 w-16 rounded-xl object-cover" alt="" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <footer className="border-t border-white/10 p-3 sm:p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 focus-within:border-violet-400">
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <label
            htmlFor="image"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl hover:bg-white/10"
          >
            <img src={assets.gallery_icon} className="w-5" alt="Attach" />
          </label>

          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="max-h-24 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-gray-500"
          />

          <button
            onClick={handleSendMessage}
            disabled={!input.trim() && !selectedImage}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <img src={assets.send_button} className="w-5" alt="Send" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatContainer;