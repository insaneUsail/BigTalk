import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatConatainer from '../components/ChatConatainer'
import RightSidebar from '../components/RightSidebar'

const Homepage = () => {

  const [selectedUser, setSelectedUser] = useState(false)

  return (
    <div class='border w-full h-screen sm:px-[10%] sm:py-[5%]'>
      <div className={`backdrop-blur-xl border-3 border-gray-600 rounded-3xl overflow-hidden h-[100%] grid relative ${selectedUser ? 'grid-cols-[1fr_1.5fr_1fr]' : 'grid-cols-2'}`}>
        <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        <ChatConatainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      </div>
    </div>
  )
}

export default Homepage