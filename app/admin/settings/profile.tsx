import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from "@/app/utility/auth";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        email: '',
        phone: '',
        facebook: '',
        instagram: '',
        telegram: '',
        viber: '',
        whatsapp: '',
        about: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);

    const token = sessionStorage.getItem('token');
    const profileID = sessionStorage.getItem('profile_id');
    const userID = sessionStorage.getItem('user_id');
    const authHeaders = getAuthHeaders();

    useEffect(() => {
        if (profileID) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${profileID}`, { headers: authHeaders })
                .then(response => response.json())
                .then(data => {
                    setFormData({
                        name: data.record.user.name || '',
                        position: data.record.position || '',
                        email: data.record.user.email || '',
                        phone: data.record.phone || '',
                        facebook: data.record.facebook || '',
                        instagram: data.record.instagram || '',
                        telegram: data.record.telegram || '',
                        viber: data.record.viber || '',
                        whatsapp: data.record.whatsapp || '',
                        about: data.record.about || '',
                        image: data.record.image || null,
                    });
                })
                .catch(error => {
                    console.error('Error fetching user profile:', error);
                });

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${sessionStorage.getItem('user_id')}`, { headers: authHeaders })
                .then(response => response.json())
                .then(data => {
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target instanceof HTMLInputElement && e.target.files ? e.target.files[0] : e.target.value,
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Update user information (JSON payload)
            const userResponse = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
                {
                    id: userID,
                    name: formData.name,
                    email: formData.email,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (userResponse.status !== 200) {
                throw new Error('Failed to update user');
            }
            const formDataToSend = new FormData();
            if (profileID) {
                formDataToSend.append('id', profileID);
            }
            if (userID) {
                formDataToSend.append('user_id', userID);
            }
            formDataToSend.append('name', formData.name);
            formDataToSend.append('position', formData.position);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('facebook', formData.facebook);
            formDataToSend.append('instagram', formData.instagram);
            formDataToSend.append('telegram', formData.telegram);
            formDataToSend.append('viber', formData.viber);
            formDataToSend.append('whatsapp', formData.whatsapp);
            formDataToSend.append('about', formData.about);
            formDataToSend.append('_method', 'PUT');

            // Append the image file only if it exists
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const profileResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/profiles`,
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (profileResponse.status !== 200) {
                throw new Error('Failed to update profile');
            }

            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Error updating profile');
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };
    ;

    return (
        <div className="p-4">
            <Toaster
                position="top-center"
            />
            <form encType="multipart/form-data">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <h1 className='col-span-2 text-gray-500 font-medium'>Profile Details</h1>
                    <div className="col-span-2 lg:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                        <input
                            type="text"
                            id="position"
                            name="position"
                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Enter your position"
                            value={formData.position}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Avatar</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Enter your position"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>

                    <h1 className='col-span-2 text-gray-500 font-medium mt-4'>Contact Information</h1>

                    <div className="col-span-2 lg:col-span-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <h1 className='col-span-2 text-gray-500 font-medium mt-4'>Social Media</h1>
                    <div className="col-span-2 lg:col-span-1">
                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">Facebook</label>
                        <input
                            type="text"
                            id="facebook"
                            name="facebook"
                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Enter your Facebook URL"
                            value={formData.facebook}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram</label>
                        <input
                            type="text"
                            id="instagram"
                            name="instagram"
                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Enter your Instagram URL"
                            value={formData.instagram}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                        <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">Telegram</label>
                        <input
                            type="text"
                            id="telegram"
                            name="telegram"
                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Enter your Telegram URL"
                            value={formData.telegram}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                        <label htmlFor="viber" className="block text-sm font-medium text-gray-700">Viber</label>
                        <input
                            type="text"
                            id="viber"
                            name="viber"
                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Enter your Viber URL"
                            value={formData.viber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">Whatsapp</label>
                        <input
                            type="text"
                            id="whatsapp"
                            name="whatsapp"
                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Enter your Whatsapp URL"
                            value={formData.whatsapp}
                            onChange={handleChange}
                        />
                    </div>

                    <h1 className='col-span-2 text-gray-500 font-medium mt-4'>About Me</h1>
                    <div className="col-span-2">
                        <textarea
                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            rows={3}
                            name="about"
                            placeholder="This is a textarea placeholder"
                            value={formData.about}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </form>

            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    className={`min-w-40 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <svg className="animate-spin h-5 w-5 ml-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default Profile;