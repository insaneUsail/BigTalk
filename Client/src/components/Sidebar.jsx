import React, { useContext, useEffect, useMemo, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const { logout, onlineUsers, authUser } = useContext(AuthContext);
  const { users, getUsers, unseenMessages, setUnseenMessages } = useContext(ChatContext);

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.fullName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUnseenMessages((prev) => {
      const updated = { ...prev };
      delete updated[user._id];
      return updated;
    });
  };

  return (
    <div className="flex h-full flex-col bg-[#0b1020]/80 text-white">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0b1020]/95 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <img src={assets.logo} alt="logo" className="max-w-32" />
            <p className="mt-1 text-xs text-gray-400">
              Welcome, {authUser?.fullName?.split(" ")[0] || "User"}
            </p>
          </div>

          <div className="group relative">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/15">
              <img src={assets.menu_icon} alt="Menu" className="h-5" />
            </button>

            <div className="absolute right-0 top-12 hidden w-44 rounded-2xl border border-white/10 bg-[#111827] p-2 shadow-xl group-hover:block">
              <button
                onClick={() => navigate("/profile")}
                className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-white/10"
              >
                Edit Profile
              </button>
              <button
                onClick={logout}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <img src={assets.search_icon} alt="Search" className="w-4 opacity-70" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-white">
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {filteredUsers.length === 0 ? (
          <div className="mt-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
              💬
            </div>
            <p className="mt-4 text-sm font-medium">No chats found</p>
            <p className="mt-1 text-xs text-gray-500">Try another search.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((user) => {
              const isOnline = onlineUsers.includes(user._id?.toString());
              const unseen = unseenMessages[user._id] || 0;
              const isSelected = selectedUser?._id === user._id;

              return (
                <button
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={`group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-500/30 to-violet-500/20 ring-1 ring-violet-400/30"
                      : "hover:bg-white/7"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={user?.profilePic || assets.avatar_icon}
                      alt={user.fullName}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#0b1020] ${
                        isOnline ? "bg-emerald-400" : "bg-gray-500"
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{user.fullName}</p>
                      <span className="text-[11px] text-gray-500">
                        {isOnline ? "Now" : "Offline"}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      {user.bio || "Tap to start chatting"}
                    </p>
                  </div>

                  {unseen > 0 && (
                    <span className="flex h-6 min-w-6 animate-pulse items-center justify-center rounded-full bg-cyan-500 px-2 text-xs font-bold">
                      {unseen}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;