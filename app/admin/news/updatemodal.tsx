import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { mutate } from 'swr';
import toast from 'react-hot-toast';
import BtnLoadingSpinner from '@/app/components/spinner';

interface UpdateNewsProps {
    initialData: {
        id: string;
        headline: string;
        url: string;
        content: string;
        date: string;
        image: File | null;
    };
    onClose: () => void;
    mutate: () => void;
}

const UpdateNews: React.FC<UpdateNewsProps> = ({ initialData, onClose }) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: initialData.id,
        headline: initialData.headline,
        url: initialData.url,
        content: initialData.content,
        date: initialData.date,
        image: initialData.image,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'image' && files) {
            setFormData((prev) => ({ ...prev, image: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, content: e.target.value }));
    };

    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            let accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const formDataToSend = new FormData();
            formDataToSend.append('id', formData.id);
            formDataToSend.append('headline', formData.headline);
            formDataToSend.append('url', formData.url);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('date', formData.date);
            formDataToSend.append('_method', 'PUT');

            if (formData.image instanceof File) {
                formDataToSend.append('image', formData.image);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/articles`,
                formDataToSend,
                { headers }
            );

            if (response?.data) {
                mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
                onClose();
                toast.success('News updated successfully!');
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMsg =
                axiosError.response?.data && typeof axiosError.response.data === 'object'
                    ? (axiosError.response.data as any).message
                    : 'An unexpected error occurred.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
                <form onSubmit={handleUpdateSubmit}>
                    <div className="flex justify-between items-center py-3 px-4 border-b">
                        <h3 className="text-lg font-bold text-gray-800 uppercase">
                            Update News and Updates
                        </h3>
                        <button
                            type="button"
                            className="p-2 text-gray-800 hover:bg-gray-200 rounded-full"
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
                                <label htmlFor="headline" className="block text-sm font-medium mb-2">
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
                                <label htmlFor="url" className="block text-sm font-medium mb-2">
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
                                <label htmlFor="content" className="block text-sm font-medium mb-2">
                                    Content
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                    placeholder="Enter content"
                                    value={formData.content}
                                    onChange={handleTextareaChange}
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="date" className="block text-sm font-medium mb-2">
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
                                <label htmlFor="image" className="block text-sm font-medium mb-2">
                                    Image
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    name="image"
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                        <button
                            type="button"
                            className="min-w-24 min-h-10 py-2 px-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`min-w-24 min-h-10 py-2 px-3 rounded-lg text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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