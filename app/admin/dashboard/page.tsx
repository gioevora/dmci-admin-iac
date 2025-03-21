"use client";


import Warning from '@/app/components/alert/warning';
import { BsBuilding, BsBuildingAdd, BsBuildingCheck } from 'react-icons/bs';
import { TbCrane, TbHomeQuestion, TbUserQuestion } from 'react-icons/tb';
import { GrStreetView } from 'react-icons/gr';
import { MdOutlinePlaylistAddCheckCircle } from 'react-icons/md';
import useSWR from 'swr';
import { getAuthHeaders } from '@/app/utility/auth';

const fetcherWithAuth = async (url: string) => {
  const headers = getAuthHeaders();
  const res = await fetch(url, {
    method: 'GET',
    headers: headers,
  });
  return await res.json();
};

const DashboardPage: React.FC = () => {
  const { data, error, } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/get-counts`,
    fetcherWithAuth
  );

  if (error) {
    return <Warning message="Failed to load data." />;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className='text-black'>

      {/* Summary Box for Property Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Count the Total Properties */}
        <div className="flex items-center bg-white p-4 shadow rounded-lg gap-4 pl-8">
          <div className='bg-green-200 p-2 text-green-900 rounded-full'>
            <BsBuilding className='h-8 w-8 ' />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{data.records.properties}</h2>
            <small className="font-semibold">Total Properties</small>
          </div>
        </div>

        {/* Count the total available properties */}
        <div className="flex items-center bg-white p-4 shadow rounded-lg gap-4 pl-8">
          <div className='bg-yellow-100 p-2 text-yellow-900 rounded-full'>
            <BsBuildingCheck className='h-8 w-8 ' />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{data.records.rfoProperties}</h2>
            <small className="font-semibold">Ready For Occupancy</small>
          </div>
        </div>

        {/* count the total number of properties under construction */}
        <div className="flex items-center bg-white p-4 shadow rounded-lg gap-4 pl-8">
          <div className='bg-red-100 p-2 text-red-900 rounded-full'>
            <TbCrane className='h-8 w-8 ' />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{data.records.underConstructionProperties}</h2>
            <small className="font-semibold">Under Construction</small>
          </div>
        </div>

        {/* count the total number of sold properties */}
        <div className="flex items-center bg-white p-4 shadow rounded-lg gap-4 pl-8">
          <div className='bg-slate-200 p-2 text-slate-900 rounded-full'>
            <BsBuildingAdd className='h-8 w-8 ' />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{data.records.newProperties}</h2>
            <small className="font-semibold">New Properties</small>
          </div>
        </div>

        <div className="flex items-center bg-white p-4 shadow rounded-lg gap-4 pl-8">
          <div className='bg-slate-200 p-2 text-slate-900 rounded-full'>
            <MdOutlinePlaylistAddCheckCircle className='h-8 w-8 ' />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{data.records.listings}</h2>
            <small className="font-semibold">Total Listings</small>
          </div>
        </div>

        <div className="flex items-center bg-white p-4 shadow rounded-lg gap-4 pl-8">
          <div className='bg-slate-200 p-2 text-slate-900 rounded-full'>
            <TbUserQuestion className='h-8 w-8 ' />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{data.records.inquiries}</h2>
            <small className="font-semibold">Total Inquiries</small>
          </div>
        </div>

        <div className="flex items-center bg-white p-4 shadow rounded-lg gap-4 pl-8">
          <div className='bg-slate-200 p-2 text-slate-900 rounded-full'>
            <GrStreetView className='h-8 w-8 ' />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{data.records.viewings}</h2>
            <small className="font-semibold">Property Viewing</small>
          </div>
        </div>

        <div className="flex items-center bg-white p-4 shadow rounded-lg gap-4 pl-8">
          <div className='bg-slate-200 p-2 text-slate-900 rounded-full'>
            <TbHomeQuestion className='h-8 w-8 ' />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{data.records.applications}</h2>
            <small className="font-semibold">Applications</small>
          </div>
        </div>

      </div>

    </div>
  );
}

export default DashboardPage;
