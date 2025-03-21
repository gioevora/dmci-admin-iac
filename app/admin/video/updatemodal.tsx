import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { mutate } from 'swr';
import toast from 'react-hot-toast';
import BtnLoadingSpinner from '@/app/components/spinner';

interface UpdateNewsProps {
    initialData: {
        id: string;
        user_id: string;
        name: string;
        video: File | null;
        thumbnail: File | null;
    };
    onClose: () => void;
    mutate: () => void;
}

const UpdateNews: React.FC<UpdateNewsProps> = ({ initialData, onClose }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        id: initialData.id,
        name: initialData.name,
        video: initialData.video,
        thumbnail: initialData.thumbnail,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (files && files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = sessionStorage.getItem('token');
            const formDataToSend = new FormData();

            formDataToSend.append('_method', 'PUT');
            formDataToSend.append('id', initialData.id);
            formDataToSend.append('user_id', initialData.user_id);
            formDataToSend.append('name', formData.name);

            if (formData.video) {
                formDataToSend.append('video', formData.video);
            }

            if (formData.thumbnail) {
                formDataToSend.append('thumbnail', formData.thumbnail);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/videos`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response?.data) {
                mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`);
                toast.success('Video updated successfully!');
                onClose();
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMsg =
                axiosError.response?.data && typeof axiosError.response.data === 'object'
                    ? (axiosError.response.data as any).message
                    : 'An unexpected error occurred.';
            setErrorMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-labelledby="update-name-modal-title"
        >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
                <form onSubmit={handleUpdateSubmit} encType="multipart/form-data">
                    <div className="flex justify-between items-center py-3 px-4 border-b">
                        <h3
                            id="update-name-modal-title"
                            className="text-lg font-bold text-gray-800 uppercase"
                        >
                            Update vidEO
                        </h3>
                        <button
                            type="button"
                            className="p-2 text-gray-800 hover:bg-gray-200 rounded-full"
                            aria-label="Close"
                            onClick={onClose}
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
                                />
                            </div>

                            <div className="col-span-4">
                                <label
                                    htmlFor="thumbnail"
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
                                />
                            </div>
                        </div>
                        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                    </div>
                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                        <button
                            type="button"
                            className="min-w-24 min-h-10 py-2 px-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`min-w-24 min-h-10 py-2 px-3 rounded-lg text-white ${loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            disabled={loading}
                        >
                            {loading ? <BtnLoadingSpinner /> : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateNews;