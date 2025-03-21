import React from 'react'
import CareerTable from './careertb'

const page = () => {
  return (
    <div className="container">
      <h1 className='font-semibold text-3xl uppercase'>Application</h1>
      <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl md:p-5 mt-8">
        <CareerTable />
      </div>
    </div>
  )
}

export default page
