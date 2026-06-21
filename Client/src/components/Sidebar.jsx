import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = ({ selectedUser, setSelectedUser }) => {
    const { logout, onlineUsers } = useContext(AuthContext);
    const { users, getUsers, unseenMessages, setUnseenMessages } = useContext(ChatContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    // Load users on mount
    useEffect(() => {
        getUsers();
    }, []);

    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        // Clear unseen count for this user once opened
        setUnseenMessages((prev) => {
            const updated = { ...prev };
            delete updated[user._id];
            return updated;
        });
    };

    return (
        <div className='mx-3 my-5'>
            <div className='pb-5'>
                {/* Header */}
                <div className='flex justify-between items-center ml-3'>
                    <img src={assets.logo} alt="logo" className='max-w-30' />
                    <div className='relative py-2 group'>
                        <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
                        <div className='absolute top-full right-0 border-2 rounded-xl border-gray-300 hidden z-20 w-32 p-3 mr-2 group-hover:block bg-gray-700'>
                            <p
                                onClick={() => navigate('/profile')}
                                className='cursor-pointer text-sm text-white'
                            >
                                Edit Profile
                            </p>
                            <hr className='my-2 border-t border-gray-500' />
                            <p
                                onClick={() => logout()}
                                className='cursor-pointer text-sm text-white'
                            >
                                Logout
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className='bg-gray-500 flex rounded-2xl items-center gap-2 py-1 px-3 m-2'>
                    <img src={assets.search_icon} alt="Search" className='w-3' />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='bg-transparent outline-none text-white placeholder-gray-300 flex-1 text-xs border-none rounded-xl'
                        placeholder='Search user...'
                    />
                </div>

                {/* Users list */}
                <div className='flex flex-col pl-1 text-white'>
                    {filteredUsers.length === 0 && (
                        <p className='text-gray-500 text-xs text-center mt-4'>No users found</p>
                    )}
                    {filteredUsers.map((user, index) => (
                        <div
                            onClick={() => handleSelectUser(user)}
                            key={index}
                            className={`relative flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-gray-700/50 transition-colors
                                ${selectedUser?._id === user._id ? 'bg-indigo-700' : ''}`}
                        >
                            <div className='relative'>
                                <img
                                    src={user?.profilePic || assets.avatar_icon}
                                    alt="userimage"
                                    className='w-12 h-12 object-cover rounded-full'
                                />
                                {onlineUsers.includes(user._id.toString()) && (
                                    <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900' />
                                )}
                            </div>
                            <div className='flex flex-col px-1 py-1 flex-1 min-w-0'>
                                <p className='truncate'>{user.fullName}</p>
                                <span className={`text-xs ${onlineUsers.includes(user._id.toString()) ? 'text-green-400' : 'text-gray-400'}`}>
                                    {onlineUsers.includes(user._id.toString()) ? 'Online' : 'Offline'}
                                </span>
                            </div>
                            {unseenMessages[user._id] > 0 && (
                                <span className='flex justify-center items-center text-xs h-5 w-5 rounded-full bg-blue-500 shrink-0'>
                                    {unseenMessages[user._id]}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;