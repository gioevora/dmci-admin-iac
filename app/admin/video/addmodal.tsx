import React, { useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import BtnLoadingSpinner from '@/app/components/spinner';

interface AddModalProps {
    mutate: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ mutate }) => {
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        video: null,
        thumbnail: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target instanceof HTMLInputElement && e.target.files ? e.target.files[0] : e.target.value,
        }));
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const user_id = sessionStorage.getItem('user_id');
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };

            const data = new FormData();
            if (user_id) {
                data.append('user_id', user_id);
            }
            data.append('name', formData.name);
            if (formData.video) {
                data.append('video', formData.video);
            }
            data.append('name', formData.name);
            if (formData.thumbnail) {
                data.append('thumbnail', formData.thumbnail);
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`, data, { headers });

            if (response?.data) {
                setFormData({
                    name: '',
                    video: null,
                    thumbnail: null,
                });
                mutate();
                setModalOpen(false);
                setLoading(false)
                toast.success('News added successfully!');
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMsg =
                axiosError.response?.data && typeof axiosError.response.data === 'object'
                    ? (axiosError.response.data as any).message
                    : 'An unexpected error occurred.';
            toast.error(errorMsg);
            setLoading(false)
        }
    };

    return (
        <div>
            <button
                type="button"
                className="min-w-[150px] py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                aria-label="Add video"
                onClick={() => setModalOpen(true)}
            >
                <IoAddCircleOutline className="h-6 w-6" /> Add Video
            </button>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    role="dialog"
                    aria-labelledby="add-headline-modal-title"
                >
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
                        <form onSubmit={handleAddSubmit} encType="multipart/form-data">
                            <div className="flex justify-between items-center py-3 px-4 border-b">
                                <h3
                                    id="add-headline-modal-title"
                                    className="text-lg font-bold text-gray-800 uppercase"
                                >
                                    Add Video
                                </h3>
                                <button
                                    type="button"
                                    className="p-2 text-gray-800 hover:bg-gray-200 rounded-full"
                                    aria-label="Close"
                                    onClick={() => setModalOpen(false)}
                                    disabled={loading}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="col-span-4">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                            placeholder="Enter name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-4">
                                        <label
                                            htmlFor="video"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Video
                                        </label>
                                        <input
                                            id="video"
                                            type="file"
                                            name="video"
                                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                            accept="video/*"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-4">
                                        <label
                                            htmlFor="video"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Thumbnail
                                        </label>
                                        <input
                                            id="thumbnail"
                                            type="file"
                                            name="thumbnail"
                                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                            accept="image/*"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                                <button
                                    type="button"
                                    className="min-w-24 min-h-10 py-2 px-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    onClick={() => setModalOpen(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`min-w-24 min-h-10 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? <BtnLoadingSpinner /> : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddModal;