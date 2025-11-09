import React, { useContext } from 'react'
import assets, { userDummyData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
const Sidebar = ({selectedUser, setSelectedUser }) => {
  const {logout} = useContext(AuthContext);
   const navigate = useNavigate()
  return (
    <div className='mx-3 my-5'>
      <div className='pb-5'>
        <div className='flex justify-between items-center  ml-3'>
          <img src={assets.logo} alt="logo" className='max-w-30' />
          <div className='relative py-2 group'>
            <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
            <div className=' absolute top-full right-0  border-2 rounded-xl border-gray-300  hidden z-20 w-24 p-3 mr-2 group-hover:block bg-gray-700'>
              <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500' />
              <p onClick={()=>logout()} className='cursor-pointer text-sm'>Logout</p>
            </div>
          </div>
        </div>
        <div className='bg-gray-500 flex rounded-2xl items-center gap-2 py-1 px-3 m-2 '>
          <img src={assets.search_icon} alt="Search" className='w-3' />
          <input type="text" className='bg-transparent outline-none text-white placeholder-gray-800 flex-1 text-xs border-none rounded-xl' placeholder='Search User...' />
        </div>
        <div className='flex flex-col pl-1  text-white'>
          {userDummyData.map((user, index) => (
            <div 
            onClick={()=>{setSelectedUser(user)}} key={index} className={`relative flex items-centergap-3 p-2 cursor-pointer ${selectedUser?._id===user._id && 'bg-indigo-700'}`}>
              <img src={user?.profilePic || assets.avatar_icon} alt="userimage"
                className='w-12 object-cover rounded-full' />
              <div className='flex flex-col px-2 py-1'>
                <p>{user.fullName}</p>
                {
                  index < 3 ? <span className='text-green-600 text-xs'> Online</span>
                    : <span className='text-xs'>Offline</span>
                }
              </div>
              {index > 2 && <p className='absolute  flex justify-center items-center top-4 text-xs right-4 border-none h-4 w-4 rounded-full bg-blue-500'>{index}</p>}
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}

export default Sidebar