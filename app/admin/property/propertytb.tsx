"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { RiArrowDownLine } from "react-icons/ri";
import { LuPenLine } from "react-icons/lu";
import toast from "react-hot-toast";
import { mutate } from "swr";

import AddProperty from "./addmodal";

import DataTable from "@/app/components/datatable";
import { getAuthHeaders } from "@/app/utility/auth";

import DeleteConfirmationModal from "@/app/components/modal/deletemodal";
import { AiOutlineDelete } from 'react-icons/ai';

type Property = {
    id: string;
    category_id: string;
    name: string;
    logo: string;
    slogan: string;
    description: string;
    location: string;
    min_price: number;
    max_price: number;
    status: string;
    percent: string;
    images: string;
    featured: number;
    user: {
        name: string
    }
};

const AlbumTable: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [propertyFilter, setPropertyFilter] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
    const [userType, setUserType] = useState<string | null>(null);
    const router = useRouter();

    let user_id;

    if (typeof window !== 'undefined' && window.sessionStorage) {
        user_id = sessionStorage.getItem('user_id');
    } else {
        user_id = null;
    }

    let accessToken;

    if (typeof window !== 'undefined' && window.sessionStorage) {
        accessToken = sessionStorage.getItem('token');
    } else {
        accessToken = null;
    }

    useEffect(() => {
        const fetchUserType = async () => {
            const headers = getAuthHeaders();
            const options: RequestInit = {
                method: 'GET',
                headers: headers,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user_id}`, options);
            const data = await response.json();
            if (data.message === "Invalid Token") {
                router.push('/auth/login');
                return;
            }
            if (response.ok) {
                const { record: user } = data;
                setUserType(user.type);
            }
        };
        fetchUserType();
    }, [router, user_id]);

    const fetchProperties = () => {
        const headers = getAuthHeaders();
        const options: RequestInit = {
            method: 'GET',
            headers: headers,
        };
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, options)
            .then((response) => {
                if (response.status === 401) {
                    router.replace('/auth/login');
                    return;
                }
                if (response.status === 429) {
                    toast.error("Too many requests. Please try again later.");
                    return;
                }
                return response.json();
            })
            .then((data) => {
                if (data.records) {
                    setProperties(data.records);
                    setLoading(false);
                }
            })
            .catch(() => {
                toast.error("Too many requests. Please try again later.");
            });
    };

    useEffect(() => {
        fetchProperties();

        const interval = setInterval(() => {
            fetchProperties();
        }, 5000);

        return () => clearInterval(interval);
    }, [router]);

    const handleDeleteClick = (propertyId: string) => {
        setPropertyToDelete(propertyId);
        setDeleteModalOpen(true);
    };

    const confirmDeleteProperty = async () => {
        if (!propertyToDelete) return;
        setDeleteBtnLoading(true);
        try {
            await deleteProperty(propertyToDelete);
            toast.success("Property deleted successfully!");
            setDeleteModalOpen(false);
            setDeleteBtnLoading(false);
        } catch (error) {
            console.error("Error deleting property:", error);
        }
    };

    const deleteProperty = async (propertyID: string) => {
        try {
            const headers = getAuthHeaders();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${propertyID}`, {
                method: "DELETE",
                headers: headers,
            });
            const data = await response.json();
            if (data.message === "Invalid Token") {
                router.push('/login');
                return;
            }
            setProperties((prevProperties) =>
                prevProperties.filter((property) => property.id !== propertyID)
            );
        } catch (error) {
            console.error("Error deleting property:", error);
        }
    };

    const handleFeaturedProperty = async (propertyId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/set/${propertyId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.message === "Invalid Token") {
                router.push('/login');
                return;
            }
            if (!response.ok) {
                throw new Error(`Failed to update property: ${response.statusText}`);
            }

            toast.success('Featured updated successfully!')
            mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`);
        } catch (error) {
            console.error('Error updating property:', error);
        }
    };

    const filteredProperties = properties.filter((prop) => {
        const matchesStatus = propertyFilter ? prop.status === propertyFilter : true;
        const matchesSearch =
            prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prop.min_price.toString().includes(searchTerm) ||
            prop.max_price.toString().includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.ceil(filteredProperties?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

    const propertyFilters = Array.from(new Set(properties.map((prop) => prop.status)));

    const columns = [
        ...(userType === "Admin" ? [{ label: "Agent Name", accessor: (prop: Property) => prop.user?.name }] : []),
        { label: "Property Name", accessor: (prop: Property) => prop.name },
        { label: "Location", accessor: (prop: Property) => prop.location },
        { label: "Min Price", accessor: (prop: Property) => prop.min_price, isPrice: true },
        { label: "Max Price", accessor: (prop: Property) => prop.max_price, isPrice: true },
        { label: "Status", accessor: (prop: Property) => prop.status, isStatus: true },

        {
            label: "Actions",
            accessor: (property: Property) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push(`/admin/property/viewproperty?id=${property.id}`)}
                        className="py-1 px-2 flex items-center bg-blue-600 text-white rounded-lg text-xs gap-1 hover:bg-blue-800"
                    >
                        <LuPenLine className="font-medium" /> Details
                    </button>
                    {property.featured === 0 ? (
                        <button
                            onClick={() => handleFeaturedProperty(property.id)}
                            className="py-1 px-2 flex items-center bg-yellow-600 text-white rounded-lg text-xs gap-1 hover:bg-red-800"
                        >
                            Featured
                        </button>
                    ) : (
                        <button
                            onClick={() => handleFeaturedProperty(property.id)}
                            className="py-1 px-2 flex items-center bg-green-600 text-white rounded-lg text-xs gap-1 hover:bg-green-800"
                        >
                            Featured
                        </button>
                    )}
                    <button
                        onClick={() => handleDeleteClick(property.id)}
                        className="py-1 px-2 flex items-center bg-red-600 text-white rounded-lg text-xs gap-1 hover:bg-red-800"
                    >
                        <AiOutlineDelete className="font-medium" /> Delete
                    </button>
                </div>
            ),
        }
    ];

    return (
        <div className="p-4">
            <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">

                    <div className="relative w-full sm:w-auto">
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="py-3 pr-10 pl-4 shadow-sm border border-gray-300 rounded-lg text-sm focus:border-gray-800 focus:outline-none appearance-none w-full sm:w-auto"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                        </select>

                        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
                            <RiArrowDownLine />
                        </span>
                    </div>

                    <div className="relative w-full">
                        <select
                            value={propertyFilter}
                            onChange={(e) => setPropertyFilter(e.target.value)}
                            className="py-3 pr-10 pl-4 shadow-sm border border-gray-300 rounded-lg text-sm focus:border-gray-800 focus:outline-none appearance-none w-full sm:w-full"
                        >
                            <option value="">All</option>
                            {propertyFilters.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                            <RiArrowDownLine />
                        </span>
                    </div>

                    <div className="relative w-full">
                        <input
                            type="text"
                            id="search"
                            className="py-3 px-4 ps-9 w-full shadow-sm border border-gray-300 rounded-lg text-sm focus:border-gray-800 focus:outline-none"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                            <GoSearch />
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 mt-4 justify-end">
                    <AddProperty />
                </div>
            </div>


            {loading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="h-12 bg-gray-200 animate-pulse rounded"></div>
                    ))}
                </div>
            ) : (
                <DataTable
                    data={currentProperties}
                    columns={columns}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                />
            )}

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteProperty}
                deleteBtnLoading={deleteBtnLoading}
                message="Are you sure you want to delete this property?"
            />
        </div>
    );
};

export default AlbumTable;