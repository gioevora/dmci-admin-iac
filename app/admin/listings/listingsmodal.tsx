import axios from 'axios';
import React, { useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import BtnLoadingSpinner from '@/app/components/spinner';

interface ListingsData {
    name: string;
    email: string;
    phone: string;
    unit_name: string;
    unit_type: string;
    unit_location: string;
    unit_price: string;
    bathrooms: string;
    description: string;
    images?: File[] | null;
    status: string;
}

interface ListingsModalProps {
    mutate?: () => void;
}

const ListingsModal: React.FC<ListingsModalProps> = ({ mutate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const [formData, setFormData] = useState<ListingsData>({
        name: '',
        email: '',
        phone: '',
        unit_name: '',
        unit_type: '',
        unit_location: '',
        unit_price: '',
        bathrooms: '',
        description: '',
        images: [],
        status: 'Pending',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            if (files) {
                setFormData((prev) => ({
                    ...prev,
                    images: Array.from(files),
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'number' ? parseInt(value, 10) : value,
            }));
        }
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token') || null;
            const userId = sessionStorage.getItem('user_id') || null;

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };

            const data = new FormData();

            Object.keys(formData).forEach((key) => {
                const value = (formData as any)[key];
                if (key === 'images' && Array.isArray(value)) {
                    value.forEach((file) => data.append('images[]', file));
                } else {
                    data.append(key, value);
                }
            });

            if (userId) data.append('user_id', userId);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`, data, { headers });

            if (response?.data) {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    unit_name: '',
                    unit_type: '',
                    unit_location: '',
                    unit_price: '',
                    bathrooms: '',
                    description: '',
                    images: [],
                    status: 'Pending',
                });
                setModalOpen(false);
                toast.success('Operation Success!')
            }
        } catch (error) {
            toast.error('Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                className="min-w-[150px] py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setModalOpen(true)}
            >
                <IoAddCircleOutline className="h-6 w-6" /> Add Listings
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-md">
                        <form onSubmit={handleAddSubmit}>
                            <h3 className="text-lg font-bold mb-4">Add Property Listings</h3>
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Owner Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        placeholder="e.g., Juan Dela Cruz"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        placeholder="e.g., juandelacruz@gmail.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        placeholder="e.g., 09924401037"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Unit Name</label>
                                    <input
                                        type="text"
                                        name="unit_name"
                                        value={formData.unit_name}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        placeholder="e.g., Sonora Garden Residences"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Unit Type</label>
                                    <select
                                        name="unit_type"
                                        className="w-full border rounded-lg p-2"
                                        value={formData.unit_type}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Unit Type</option>
                                        <option value="1 Bedroom">1 Bedroom</option>
                                        <option value="2 Bedroom">2 Bedroom</option>
                                        <option value="3 Bedroom">3 Bedroom</option>
                                        <option value="Loft">Loft</option>
                                        <option value="Studio">Studio</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="unit_location"
                                        value={formData.unit_location}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        placeholder="e.g., Pasig City, Philippines"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Price</label>
                                    <input
                                        type="text"
                                        name="unit_price"
                                        value={formData.unit_price}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        placeholder="e.g., 1000000"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                                    <input
                                        type="text"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        placeholder="Provide a brief description of the property..."
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Images</label>
                                    <input
                                        type="file"
                                        name="images"
                                        multiple
                                        onChange={handleChange}
                                        className="block w-full text-sm border rounded-lg p-2"
                                        required
                                    />
                                </div>
                                {/* <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="available">Available</option>
                                        <option value="sold">Sold</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div> */}
                            </div>
                            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                                <button
                                    type="button"
                                    className="min-w-24 min-h-10 py-2 px-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    onClick={() => setModalOpen(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`min-w-24 min-h-10 py-2 px-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <BtnLoadingSpinner />
                                    ) : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListingsModal;