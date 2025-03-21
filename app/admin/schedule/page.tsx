import React from 'react';
import Calendar from './calendar';

const Page = () => {
  return (
    <div className="container">
      <h1 className="font-semibold text-3xl uppercase">Schedule</h1>
      <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 mt-8">
        <Calendar />
      </div>
    </div>
  );
};

export default Page;
