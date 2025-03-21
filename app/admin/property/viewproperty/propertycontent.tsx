'use client';

import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import PropertyImageSlider from './propertyimageslider';

import { getAuthHeaders } from '@/app/utility/auth';
import BtnLoadingSpinner from '@/app/components/spinner';

interface PropertyDetailsContentProps {
  id: string | null;
}

interface PropertyData {
  user_id?: string;
  name: string;
  logo?: string;
  status: string;
  location: string;
  min_price: string;
  max_price: string;
  slogan: string;
  description: string;
  percent: string;
  images?: string;
}

const fetcherWithAuth = async (url: string) => {
  const headers = getAuthHeaders();
  const res = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!res.ok) throw new Error('Failed to fetch data');

  return await res.json();
};

const PropertyDetailsContent: React.FC<PropertyDetailsContentProps> = ({ id }) => {
  const router = useRouter()
  const { data, error, mutate } = useSWR<{ record: PropertyData }>(
    id ? `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}` : null,
    fetcherWithAuth
  );

  const [btnLoading, setBtnLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  const formData = data?.record || {
    name: '',
    logo: '',
    status: '',
    location: '',
    min_price: '',
    max_price: '',
    slogan: '',
    description: '',
    percent: '',
    images: '',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    mutate({ record: { ...formData, [name]: value } }, false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.name === 'logo') {
        setSelectedLogo(e.target.files[0]);
      } else {
        setSelectedImages(Array.from(e.target.files));
      }
    }
  };

  const handleSaveConfirmation = async () => {
    if (!data) {
      toast.error('No property data found to update.');
      setTimeout(() => setModalOpen(false), 5000);
      return;
    }

    setBtnLoading(true);

    try {
      const accessToken = sessionStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const formDataToSend = new FormData();
      formDataToSend.append('_method', 'PUT');
      formDataToSend.append('id', id || '');
      formDataToSend.append('user_id', data.record.user_id || '');

      Object.keys(formData).forEach((key) => {
        if (key !== 'images' && formData[key as keyof PropertyData]) {
          formDataToSend.append(key, formData[key as keyof PropertyData]!);
        }
        if (selectedLogo) {
          formDataToSend.append('logo', selectedLogo);
        }
      });

      selectedImages.forEach((file) => {
        formDataToSend.append('images[]', file);
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties`,
        formDataToSend,
        { headers }
      );

      if (response?.data) {
        toast.success('Property Updated Successfully');
        mutate();

        // RESET FILES
        setSelectedLogo(null);
        setSelectedImages([]);
        const logoInput = document.querySelector("input[name='logo']") as HTMLInputElement;
        const imagesInput = document.querySelector("input[name='images']") as HTMLInputElement;
        if (logoInput) logoInput.value = "";
        if (imagesInput) imagesInput.value = "";
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(
        (axiosError.response?.data as { message?: string })?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setModalOpen(false);
      setBtnLoading(false);
    }
  };

  if (error) return <div className="text-red-500">Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  const images = JSON.parse(data.record.images || '[]');

  const logo = data.record.logo || "no-image.jpeg";

  return (
    <div className="mt-4 overflow-y-auto">
      <div className="flex justify-center mb-2">
        <div className="relative bg-black inline-block rounded">
          <img className="h-16 w-auto" src={`https://dmci-agent-bakit.s3.ap-southeast-1.amazonaws.com/properties/logos/${logo}`} />
        </div>
      </div>

      <PropertyImageSlider images={images} />
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="w-full">
            <label htmlFor="name" className="block text-sm font-medium mb-2">Property Name</label>
            <input
              type="text"
              name="name"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Sonora Garden Residences"
              value={formData.name || ''}
              onChange={handleChange}
            />
          </div>

          <div className="w-full">
            <label htmlFor="status" className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.status || ''}
              onChange={handleChange}
            >
              <option value="Under Construction">Under Construction</option>
              <option value="Ready For Occupancy">Ready For Occupancy</option>
              <option value="New">New</option>
            </select>
          </div>

          <div className="w-full">
            <label htmlFor="percent" className="block text-sm font-medium mb-2">Percent</label>
            <input
              type="text"
              name="percent"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Percent"
              value={formData.percent || ''}
              onChange={handleChange}
            />
          </div>

          <div className="w-full">
            <label htmlFor="location" className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Location"
              value={formData.location || ''}
              onChange={handleChange}
            />
          </div>

          <div className="w-full">
            <label htmlFor="min_price" className="block text-sm font-medium mb-2">Min Price</label>
            <input
              type="number"
              name="min_price"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Min Price"
              value={formData.min_price || ''}
              onChange={handleChange}
            />
          </div>

          <div className="w-full">
            <label htmlFor="max_price" className="block text-sm font-medium mb-2">Max Price</label>
            <input
              type="number"
              name="max_price"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Max Price"
              value={formData.max_price || ''}
              onChange={handleChange}
            />
          </div>

          <div className="w-full sm:col-span-2 md:col-span-3">
            <label htmlFor="slogan" className="block text-sm font-medium mb-2">Slogan</label>
            <input
              type="text"
              name="slogan"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Slogan"
              value={formData.slogan || ''}
              onChange={handleChange}
            />
          </div>

          <div className="w-full sm:col-span-2 md:col-span-3">
            <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Property Description"
              value={formData.description || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="w-full">
            <label htmlFor="Logo" className="block text-sm font-medium mb-2">Logo</label>
            <input
              type="file"
              name="logo"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="w-full">
            <label htmlFor="Images" className="block text-sm font-medium mb-2">Images</label>
            <input
              type="file"
              name="images"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex flex-col justify-end sm:flex-row gap-3 mt-4">
          <button
            type="button"
            className="py-2 px-3 min-w-[100px] inline-flex items-center justify-center text-sm font-medium rounded-lg border border-blue-600 hover:bg-blue-700 focus:outline-none hover:text-white focus:bg-blue-700"
            onClick={() => router.push('/admin/property')}
          >
            Back
          </button>
          <button
            type="submit"
            className="py-2 px-3 min-w-[100px] inline-flex items-center justify-center text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>

      {
        isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-medium mb-4">Confirm Save</h2>
              <p>Are you sure you want to save these changes?</p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="min-w-[100px] py-2 px-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setModalOpen(false)}
                  disabled={btnLoading}
                >
                  Cancel
                </button>
                <button
                  className={`min-w-[100px] py-2 px-3 text-sm font-medium text-white rounded-lg ${btnLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  onClick={handleSaveConfirmation}
                  disabled={btnLoading}
                >
                  {btnLoading ? <BtnLoadingSpinner /> : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default PropertyDetailsContent;