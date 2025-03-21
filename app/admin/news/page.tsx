import React from 'react'
import NewsTable from './newstb'



const page = () => {
  return (
    <div className="container">
      <h1 className='font-semibold text-3xl uppercase'>News and Updates</h1>
      <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl md:p-5 mt-8">
        <NewsTable />
      </div>
    </div>

  )
}

export default page
