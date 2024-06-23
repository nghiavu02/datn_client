import React from 'react'

const SelectOption = ({icons}) => {
  return (
    <div className='w-10 h-10 bg-white rounded-full border shadow-md flex items-center justify-center hover:bg-gray-800 hover:text-white cursor-pointer hover:border-gray-800'>{icons}</div>
  )
}

export default SelectOption