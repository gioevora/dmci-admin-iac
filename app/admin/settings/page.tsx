'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import ProfileMenu from './profilemenu';

import { getAuthHeaders } from '@/app/utility/auth';

const fetcherWithAuth = async (url: string) => {
  const headers = getAuthHeaders();
  const res = await fetch(url, {
    method: 'GET',
    headers: headers,
  });
  return await res.json();
};

const SettingsPage = () => {
  const [profileID, setProfileID] = useState<string | null>(null);

  useEffect(() => {
    const storedProfileID = sessionStorage.getItem('profile_id');
    if (storedProfileID) {
      setProfileID(storedProfileID);
    }
  }, []);

  const { data: profile, error } = useSWR(profileID ? `${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${profileID}` : null, fetcherWithAuth,
    {
      refreshInterval: 5000,
    }
  );

  if (error) {
    return <p>Failed to load profile</p>;
  }

  if (!profile) {
    return <div>  <ProfileMenu /></div>;
  }

  return (
    <div className="container">
      <h1 className="font-semibold text-3xl uppercase">Settings</h1>
      <ol className="flex items-center whitespace-nowrap">
        <li className="inline-flex items-center">
          <a
            className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
            href="#"
          >
            Home
          </a>
          <svg
            className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </li>
        <li className="inline-flex items-center">
          <a
            className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
            href="#"
          >
            Settings
            <svg
              className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>
        </li>
        <li
          className="inline-flex items-center text-sm font-semibold text-black truncate"
          aria-current="page"
        >
          Profile
        </li>
      </ol>
      <div className="w-full mx-auto bg-white border border-gray-200 shadow-sm rounded-xl p-4 lg:p-12 mt-4">
        <div className="flex items-center gap-4 mb-6">
          <img
            className="inline-block size-[62px] rounded-full"
            src={
              profile.record?.image
                ? `https://dmci-agent-bakit.s3.amazonaws.com/profiles/${profile.record.image}`
                : 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
            }
            alt="Avatar"
          />
          <div className="">
            <h1 className="flex items-baseline text-2xl font-medium">
              {profile.record?.user.name || 'Name'} / {profile.record?.position || 'Position'}
            </h1>
            <small className="text-gray-400">
              Update your profile and manage your account
            </small>
          </div>
        </div>
        <ProfileMenu />
      </div>
    </div>
  );
};

export default SettingsPage;