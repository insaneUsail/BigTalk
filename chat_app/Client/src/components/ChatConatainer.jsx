import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../library/utils'

const ChatConatainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return selectedUser ? (
    // header 
    <div className='h-full overflow-hidden relative backdrop-blur-lg'>
      <div className='flex items-center gap-3 py-3 mx-4 border-b scroll border-stone-500'>
        <img src={assets.profile_martin} className='w-10 rounded-full' alt="" />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          Martin Johnson
          <span className='top-5 w-2 h-2 rounded-full bg-green-500'></span>
        </p>
        <img onClick={() => setSelectedUser(false)} src={assets.arrow_icon} className='md:hidden max-w-7' alt="" />
        <img src={assets.help_icon} className='max-md:hidden max-w-5' alt="" />
      </div>
      {/* // chat  */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll  p-3 pb-6'>
        {
          messagesDummyData.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId != '680f50e4f10f3cd28382ecf9' && 'flex-row-reverse'}`}>
              {msg.image ? (
                <img src={msg.image} className='max-w-[230px] broder border-gray-700 rounded-lg overflow-hidden mb-8' />) :
                (
                  <p className={`p-2 max-2-[200px] md:text-sm font-light 
                    rounded-lg mb-8 break all bg-violet-500/30 text-while ${msg.senderId === '680f50e4f10f3cd28382ecf9' ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                )}
              <div className='text-centre text-xs'>
                <img src={msg.senderId === '680f50e4f10f3cd28382ecf9' ? assets.avatar_icon : assets.profile_martin} className='w-7 rounded-full' alt="" />
                <p className='text-gray-500'>
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>

          ))}
        <div ref={scrollEnd}>
        </div>
      </div>
      {/* bottom area */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 rounded-full'>
          <input type="text" placeholder='Send a message' 
          className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white
           placeholder-gray-400'/>
          <input type="file" id='image' accept='image/png, image/jpeg' hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} className='w-5 mr-3 cursor-pointer' alt="" />
          </label>
        </div>
              <img src={assets.send_button} className='w-7 cursor-pointer' alt="" />

      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} className='max-w-16' alt="" />
      <p className='text-lg font-medium'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatConatainer