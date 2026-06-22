import React, { useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const RightSidebar = ({ selectedUser, onClose }) => {
  const { logout, onlineUsers } = useContext(AuthContext);
  const { messages } = useContext(ChatContext);

  if (!selectedUser) {
    return (
      <div className="hidden h-full items-center justify-center bg-[#0b1020]/80 p-6 text-center text-gray-500 lg:flex">
        Select a user to view details.
      </div>
    );
  }

  const sharedMedia = messages.filter((msg) => msg.image).map((msg) => msg.image);
  const isOnline = onlineUsers.includes(selectedUser?._id?.toString());

  return (
    <div className="flex h-full flex-col bg-[#0b1020]/90 text-white">
      <div className="flex items-center justify-between border-b border-white/10 p-4 lg:hidden">
        <p className="font-semibold">Profile Info</p>
        <button onClick={onClose} className="rounded-full bg-white/10 px-3 py-1">
          ×
        </button>
      </div>

      <div className="flex flex-col items-center border-b border-white/10 px-6 py-8 text-center">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          className="h-24 w-24 rounded-full object-cover ring-4 ring-violet-500/20"
          alt={selectedUser.fullName}
        />

        <h2 className="mt-4 text-xl font-bold">{selectedUser.fullName}</h2>

        <p className={`mt-1 text-xs ${isOnline ? "text-emerald-400" : "text-gray-500"}`}>
          {isOnline ? "● Online" : "● Offline"}
        </p>

        <p className="mt-4 max-w-xs text-sm italic text-gray-400">
          {selectedUser.bio || "No bio added yet."}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-5 grid grid-cols-2 gap-3">
          <button className="rounded-2xl bg-white/5 px-4 py-3 text-sm hover:bg-white/10">
            📞 Call
          </button>
          <button className="rounded-2xl bg-white/5 px-4 py-3 text-sm hover:bg-white/10">
            🔍 Search
          </button>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Shared Media</p>
            <p className="text-xs text-gray-500">{sharedMedia.length}</p>
          </div>

          {sharedMedia.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {sharedMedia.slice(0, 8).map((url, index) => (
                <button
                  key={index}
                  onClick={() => window.open(url)}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  <img src={url} className="h-24 w-full object-cover transition hover:scale-105" alt="Shared media" />
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">
              No photos shared yet
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 p-5">
        <button className="mb-3 w-full rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300 hover:bg-red-500/20">
          Delete Chat
        </button>
        <button
          onClick={logout}
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 text-sm font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;