import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';

const Homepage = () => {
    const [selectedUser, setSelectedUser] = useState(false);

    return (
        // Fixed: was class= instead of className=
        <div className='border w-full h-screen sm:px-[10%] sm:py-[5%]'>
            <div className={`backdrop-blur-xl border-3 border-gray-600 rounded-3xl overflow-hidden h-full grid relative
                ${selectedUser ? 'grid-cols-[1fr_1.5fr_1fr]' : 'grid-cols-2'}`}
            >
                <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                {selectedUser && <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />}
            </div>
        </div>
    );
};

export default Homepage;