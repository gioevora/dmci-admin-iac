import React from 'react'
import QuestionTable from './questiontb'



const page = () => {
  return (
    <div className="container">
      <h1 className='font-semibold text-3xl uppercase'>Frequently asked questions</h1>
      <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl md:p-5 mt-8">
        <QuestionTable />
      </div>


    </div>

  )
}

export default page
