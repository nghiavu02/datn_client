import React, { memo } from 'react'
import icons from "../../ultils/icons";

const { MdEmail } = icons

const Footer = () => {
  return (
    <div className='w-full'>
      <div className='h-[103px] bg-main w-full flex justify-center items-center'>
        <div className='w-main flex items-center justify-between'>
          <div className='flex flex-col flex-1'>
            <span className='text-[20px] text-gray-100'>SIGN UP</span>
            <small className='text-[13px] text-gray-300'>Subscribe now</small>
          </div>
          <div className='flex-1 flex items-center'>
            <input
              type="text"
              className='p-4 pr-0 rounded-l-full w-full bg-[#F04646] outline-none text-gray-100 placeholder:text-sm placeholder:text-gray-200 placeholder:italic placeholder:opacity-50'
              placeholder='Email address'
            />
            <div className='h-[56px] w-[56px] bg-[#F04646] rounded-r-full flex items-center justify-center text-white'>
              <MdEmail size={18} />
            </div>
          </div>
        </div>
      </div>
      <div className='h-[407px] w-full bg-gray-900 flex justify-center items-center text-white text-[13px]'>
        <div className='w-main flex'>
          <div className='flex-2 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>ABOUT US</h3>
            <span>
              <span>Address: </span>
              <span className='opacity-70'>180 TB</span>
            </span>
            <span>
              <span>Phone: </span>
              <span className='opacity-70'>09678166129</span>
            </span>
            <span>
              <span>Mail: </span>
              <span className='opacity-70'>fake@gmail.com</span>
            </span>
          </div>
          <div className='flex-1 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>INFORMATION</h3>
            <span>Type</span>
            <span>Gall</span>
            <span>Store</span>
            <span>Today's</span>
            <span>Contacts</span>
          </div>
          <div className='flex-1 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>WHO WE AEE</h3>
            <span>Help</span>
            <span>Free</span>
            <span>FAQs</span>
            <span>Return</span>
            <span>Test</span>
          </div>
          <div className='flex-1 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>#WORLD</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Footer)