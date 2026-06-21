import React, { useContext } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const RightSidebar = ({ selectedUser }) => {
    const { logout, onlineUsers } = useContext(AuthContext);
    const { messages } = useContext(ChatContext);

    // Filter only image messages from conversation with selected user
    const sharedMedia = messages
        .filter((msg) => msg.image)
        .map((msg) => msg.image);

    const isOnline = onlineUsers.includes(selectedUser?._id?.toString());

    return selectedUser ? (
        <div className='bg-gray-900/45 text-white w-full relative overflow-y-auto'>
            {/* Profile section */}
            <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
                <img
                    src={selectedUser?.profilePic || assets.avatar_icon}
                    className='w-20 aspect-square rounded-full object-cover'
                    alt=""
                />
                <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
                    {isOnline && <p className="w-2 h-2 rounded-full bg-green-500"></p>}
                    {selectedUser.fullName}
                </h1>
                <p className="px-10 mx-auto text-center text-gray-400">
                    {selectedUser.bio || "No bio yet"}
                </p>
            </div>

            <hr className='border-gray-500 mx-4 my-4' />

            {/* Shared media section */}
            <div className='px-5 text-xs'>
                <p className='text-gray-300 mb-2'>Shared Media</p>
                {sharedMedia.length > 0 ? (
                    <div className='mt-2 max-h-[300px] overflow-y-auto grid grid-cols-2 gap-2 opacity-80'>
                        {sharedMedia.map((url, index) => (
                            <div
                                key={index}
                                onClick={() => window.open(url)}
                                className='cursor-pointer rounded'
                            >
                                <img
                                    src={url}
                                    className='w-full h-24 object-cover rounded-md'
                                    alt=""
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-gray-500 mt-2'>No media shared yet</p>
                )}
            </div>

            {/* Logout button */}
            <button
                onClick={logout}
                className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-10 rounded-full cursor-pointer whitespace-nowrap"
            >
                Logout
            </button>
        </div>
    ) : null;
};

export default RightSidebar;