import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";

const Homepage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <main className="h-screen w-full p-0 sm:p-4 lg:p-6">
      <section className="mx-auto h-full max-w-[1500px] overflow-hidden border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-2xl sm:rounded-3xl">
        <div className="grid h-full grid-cols-1 md:grid-cols-[310px_1fr] lg:grid-cols-[320px_1fr_320px]">
          <aside className={`${selectedUser ? "hidden md:block" : "block"} h-full border-r border-white/10`}>
            <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
          </aside>

          <section className={`${selectedUser ? "block" : "hidden md:block"} h-full`}>
            <ChatContainer
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              showInfo={showInfo}
              setShowInfo={setShowInfo}
            />
          </section>

          <aside className="hidden h-full border-l border-white/10 lg:block">
            <RightSidebar selectedUser={selectedUser} />
          </aside>

          {showInfo && selectedUser && (
            <div className="fixed inset-0 z-50 bg-black/60 lg:hidden">
              <div className="ml-auto h-full w-[85%] max-w-sm bg-[#0f172a]">
                <RightSidebar selectedUser={selectedUser} onClose={() => setShowInfo(false)} />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Homepage;