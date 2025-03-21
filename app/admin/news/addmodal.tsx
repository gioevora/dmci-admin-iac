import React, { useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import BtnLoadingSpinner from '@/app/components/spinner';

interface AddNewsProps {
    mutate: () => void;
}

const AddNews: React.FC<AddNewsProps> = ({ mutate }) => {
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        headline: '',
        url: '',
        content: '',
        date: '',
        image: null,
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
            let accessToken;

            if (typeof window !== 'undefined' && window.sessionStorage) {
                accessToken = sessionStorage.getItem('token');
            } else {
                // Handle server-side logic or fallback
                accessToken = null; // or fetch from another source
            }

            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            };

            const data = new FormData();
            data.append('headline', formData.headline);
            data.append('url', formData.url);
            data.append('content', formData.content);
            data.append('date', formData.date);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, data, { headers });

            if (response?.data) {
                setFormData({
                    headline: '',
                    url: '',
                    content: '',
                    date: '',
                    image: null,
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
        }
    };

    return (
        <div>
            <button
                type="button"
                className="min-w-[150px] py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                aria-label="Add news and updates"
                onClick={() => setModalOpen(true)}
            >
                <IoAddCircleOutline className="h-6 w-6" /> Add news
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
                                    Add News and Updates
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
                                            htmlFor="headline"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Headline
                                        </label>
                                        <input
                                            id="headline"
                                            type="text"
                                            name="headline"
                                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                            placeholder="Enter headline"
                                            value={formData.headline}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-4">
                                        <label
                                            htmlFor="headline"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            URL
                                        </label>
                                        <input
                                            id="url"
                                            type="text"
                                            name="url"
                                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                            placeholder="Enter URL"
                                            value={formData.url}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-4">
                                        <label
                                            htmlFor="content"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Content
                                        </label>
                                        <textarea
                                            id="content"
                                            name="content"
                                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                            placeholder="Enter content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label
                                            htmlFor="date"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Date
                                        </label>
                                        <input
                                            id="date"
                                            type="date"
                                            name="date"
                                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                            placeholder="Enter date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label
                                            htmlFor="image"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Image
                                        </label>
                                        <input
                                            id="image"
                                            type="file"
                                            name="image"
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

export default AddNews;