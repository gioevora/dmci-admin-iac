import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface Certificate {
    id: number;
    title: string;
    description: string;
    date: string;
    image: string;
}

const Certificate = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        date: string;
        image: File | null;
    }>({
        title: '',
        description: '',
        date: '',
        image: null,
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const accessToken = sessionStorage.getItem('token');
                if (!accessToken) {
                    console.error('No token found');
                    return;
                }

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/certificates`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const sortedCertificates = response.data.records.sort(
                    (a: Certificate, b: Certificate) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setCertificates(sortedCertificates);
            } catch (err) {
                console.error('Error fetching certificates:', err);
            }
        };

        fetchCertificates();
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            image: files ? files[0] : null,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

            Object.keys(formData).forEach((key) => {
                const value = formData[key as keyof typeof formData];
                if (key === 'image' && value instanceof File) {
                    form.append(key, value);
                } else if (key !== 'image') {
                    form.append(key, value as string);
                }
            });

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/certificates`, form, { headers });

            if (response?.data?.record) {
                const newCertificate = response.data.record;

                setCertificates((prevCertificates) => {
                    const updatedCertificates = [newCertificate, ...prevCertificates].sort(
                        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
                    return updatedCertificates;
                });
            }

            setFormData({
                title: '',
                description: '',
                date: '',
                image: null,
            });

            setShowForm(false);
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

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    };

    const groupByMonth = (certificates: Certificate[]) => {
        return certificates.reduce((groups: { [key: string]: Certificate[] }, certificate: Certificate) => {
            const monthYear = formatDate(certificate.date);
            if (!groups[monthYear]) {
                groups[monthYear] = [];
            }
            groups[monthYear].push(certificate);
            return groups;
        }, {});
    };

    const groupedCertificates = groupByMonth(certificates);

    return (
        <div>
            {Object.keys(groupedCertificates).map((monthYear) => (
                <div key={monthYear}>
                    <div className="ps-3 my-2 first:mt-0">
                        <h3 className="text-xs font-medium uppercase text-gray-500">
                            {monthYear}
                        </h3>
                    </div>
                    {groupedCertificates[monthYear].map((certificate) => (
                        <div key={certificate.id}>
                            <div className="flex gap-x-3 relative group rounded-lg hover:bg-gray-100">
                                <a className="z-[1] absolute inset-0" href="#"></a>
                                <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
                                    <div className="relative z-10 size-7 flex justify-center items-center">
                                        <div className="size-2 rounded-full bg-white border-2 border-gray-300 group-hover:border-gray-600"></div>
                                    </div>
                                </div>
                                <div className="grow p-2 pb-8">
                                    <h3 className="flex gap-x-1.5 font-semibold text-gray-800">
                                        {certificate.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {certificate.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            <div className="flex justify-start mt-4">
                <button
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setShowForm(!showForm)}
                >
                    Add New Certificate
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 pointer-events-auto">
                    <div className="relative bg-white rounded-lg w-1/3 p-6 z-50">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
                        >
                            &times;
                        </button>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificate;
