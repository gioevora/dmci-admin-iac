'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, Suspense } from 'react';
import PropertyDetailsContent from './propertycontent';
import { LuBuilding2 } from 'react-icons/lu';
import { MdOutlineMapsHomeWork, MdOutlineMeetingRoom } from 'react-icons/md';
import { RiBuilding2Line } from 'react-icons/ri';
import { BsBuildingCheck } from 'react-icons/bs';
import PropertyUnits from './units';
import PropertyBuilding from './building';
import MasterPlan from './plan';
import Features from './features';

const PropertyDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [activeTab, setActiveTab] = useState(1);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 1:
        return <PropertyDetailsContent id={id} />;
      case 2:
        return <PropertyUnits id={id} />;
      case 3:
        return <PropertyBuilding id={id} />;
      case 4:
        return <MasterPlan id={id} />;
      case 5:
        return <Features id={id} />;
      default:
        return <div>Default Content</div>;
    }
  }, [activeTab, id]);

  return (
    <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl p-4 md:p-5">
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-x-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab(1)}
            className={`py-2 px-2 md:px-4 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap focus:outline-none ${activeTab === 1
              ? 'font-semibold border-blue-600 text-blue-600'
              : 'text-gray-500 border-transparent hover:text-blue-600'
              }`}
          >
            <LuBuilding2 /> Property
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`py-2 px-2 md:px-4 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap focus:outline-none ${activeTab === 2
              ? 'font-semibold border-blue-600 text-blue-600'
              : 'text-gray-500 border-transparent hover:text-blue-600'
              }`}
          >
            <MdOutlineMeetingRoom /> Units
          </button>
          <button
            onClick={() => setActiveTab(3)}
            className={`py-2 px-2 md:px-4 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap focus:outline-none ${activeTab === 3
              ? 'font-semibold border-blue-600 text-blue-600'
              : 'text-gray-500 border-transparent hover:text-blue-600'
              }`}
          >
            <RiBuilding2Line /> Building
          </button>
          <button
            onClick={() => setActiveTab(4)}
            className={`py-2 px-2 md:px-4 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap focus:outline-none ${activeTab === 4
              ? 'font-semibold border-blue-600 text-blue-600'
              : 'text-gray-500 border-transparent hover:text-blue-600'
              }`}
          >
            <MdOutlineMapsHomeWork /> Master Plan
          </button>
          <button
            onClick={() => setActiveTab(5)}
            className={`py-2 px-2 md:px-4 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap focus:outline-none ${activeTab === 5
              ? 'font-semibold border-blue-600 text-blue-600'
              : 'text-gray-500 border-transparent hover:text-blue-600'
              }`}
          >
            <BsBuildingCheck /> Features
          </button>
        </nav>
      </div>
      <div className="p-4 flex-1">{tabContent}</div>
    </div>
  );
};

export default function PropertyDetailsWrapper() {
  return (
    <Suspense fallback={<div>Loading sections...</div>}>
      <PropertyDetails />
    </Suspense>
  );
}