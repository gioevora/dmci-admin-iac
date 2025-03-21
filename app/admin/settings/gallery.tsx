import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

function Gallery() {
  const [images, setImages] = useState<{ image: string; name: string; id: number }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number }>({ show: false, id: 0 });
  const [formData, setFormData] = useState<{
    name: string;
    image: File | null;
  }>({
    name: '',
    image: null,
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const accessToken = sessionStorage.getItem('token');
        if (!accessToken) {
          console.error('No token found');
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/images`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setImages(response.data.records.map((item: { image: string; name: string; id: number }) => ({
          image: item.image,
          name: item.name,
          id: item.id,
        })));
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const userId = sessionStorage.getItem('user_id');
    if (userId) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: userId,
      }));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewImage(file);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageName(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const accessToken = sessionStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      };

      const form = new FormData();

      const userId = sessionStorage.getItem('user_id');
      if (userId) {
        form.append('user_id', userId);
      }

      const formData = { image: newImage, name: imageName };

      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof typeof formData];
        if (key === 'image' && value instanceof File) {
          form.append(key, value);
        } else if (key !== 'image') {
          form.append(key, value as string);
        }
      });

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/images`, form, { headers });

      if (response?.data?.image) {
        const newImageData = {
          image: response.data.image,
          name: response.data.name,
          id: response.data.id,
        };

        setImages((prevImages) => [newImageData, ...prevImages]);
      }

      setNewImage(null);
      setImageName('');
      setShowModal(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
        alert((axiosError.response.data as any).message || 'An error occurred. Please try again.');
        console.log(axiosError);
      } else {
        alert('An unexpected error occurred.');
        console.log(axiosError);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/images/${id}`);
      console.log('Response:', response);
      if (response.data.code === 200) {
        setImages(images.filter((image) => image.id !== id));
      }
      setDeleteConfirm({ show: false, id: 0 });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error deleting image:', error.response ? error.response.data : error.message);
      } else {
        console.error('Unexpected error deleting image:', error);
      }
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteConfirm({ show: true, id });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, id: 0 });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" x2="12" y1="3" y2="15"></line>
          </svg>
          Upload photo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((image) => (
          image?.image ? (
            <div key={image.id} className="relative overflow-hidden rounded-lg shadow-lg group">
              <img
                src={`https://dmci-agent-bakit.s3.amazonaws.com/images/${image.image}`}
                className="w-full h-40 object-cover transform transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button
                  onClick={() => confirmDelete(image.id)}
                  className="bg-red-500 text-white p-2 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="absolute bottom-2 left-2 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {image.name}
              </div>
            </div>
          ) : null
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Image</h3>
            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={imageName}
                onChange={handleNameChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={(e) => handleSubmit(e)}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Are you sure you want to delete this image?</h3>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
