import React from 'react'
import Table from './table'



const page = () => {
  return (
    <div className="container">
      <h1 className='font-semibold text-3xl uppercase'>Inquiry</h1>
      <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl md:p-5 mt-8">
        <Table />
      </div>


    </div>

  )
}

export default page
