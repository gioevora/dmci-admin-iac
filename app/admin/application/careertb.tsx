"use client";

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import Link from 'next/link';
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";

import DataTable from '@/app/components/datatable';
import DeleteConfirmationModal from '@/app/components/modal/deletemodal';
import AddNews from './addmodal';
import UpdateNews from './updatemodal';

import { getAuthHeaders } from '@/app/utility/auth';

import { GoSearch } from 'react-icons/go';
import { RiArrowDownLine } from 'react-icons/ri';
import { LuPenLine, LuTrash2 } from 'react-icons/lu';
import { useRouter } from 'next/navigation';

type Category = {
    id: string;
    position: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    resume: string;
};

const CareerTable: React.FC = () => {
    const router = useRouter();

    const fetcherWithAuth = async (url: string) => {
        const headers = getAuthHeaders();

        const res = await fetch(url, {
            method: "GET",
            headers: headers,
        });

        if (res.status === 401) {
            router.replace("/auth/login");
            return;
        }

        if (res.status === 429) {
            toast.error("Too many requests. Please try again later.");
            return;
        }

        return await res.json();
    };
    const { data, error, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, fetcherWithAuth);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (data && !error) {
            setCategories(data.records);
            setIsLoading(false);
        }
    }, [data, error]);

    const handleDeleteClick = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setDeleteModalOpen(true);
    };

    const confirmDeleteCategory = async () => {
        if (!categoryToDelete) return;
        await deleteCategory(categoryToDelete);
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        toast.success('Application deleted successfully!');
    };

    const deleteCategory = async (categoryId: string) => {
        try {
            const headers = getAuthHeaders();
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${categoryId}`, {
                method: 'DELETE',
                headers: headers
            });
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== categoryId)
            );
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    // Function to open update modal
    const handleUpdateClick = (category: Category) => {
        setCategoryToUpdate(category);
        setUpdateModalOpen(true);
    };

    const closeUpdateModal = () => setUpdateModalOpen(false);

    const filteredCategories = categories.filter((category) =>
        category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.position && category.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.email && category.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.phone && category.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.address && category.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCategories?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

    const columns = [
        { label: 'Name', accessor: (category: Category) => category.name },
        { label: 'Position', accessor: (category: Category) => category.position },
        { label: 'Email', accessor: (category: Category) => category.email },
        { label: 'Phone', accessor: (category: Category) => category.phone },
        { label: 'Address', accessor: (category: Category) => category.address },
        {
            label: 'Resume',
            accessor: (category: Category) => (
                <Gallery withDownloadButton>
                    <Item original={`https://dmci-agent-bakit.s3.ap-southeast-1.amazonaws.com/careers/applications/${category.resume}`} height="500" width="500">
                        {({ ref, open }) => (
                            <img
                                ref={ref}
                                onClick={open}
                                src={`https://dmci-agent-bakit.s3.ap-southeast-1.amazonaws.com/careers/applications/${category.resume}`}
                                alt="Resume"
                                className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                            />
                        )}
                    </Item>
                </Gallery>
            ),
        }
        // {
        //     label: 'Actions',
        //     accessor: (category: Category) => (
        //         <div className='flex gap-2'>
        //             {/* <button
        //                 onClick={() => handleUpdateClick(category)}
        //                 className="py-1 px-2 flex items-center text-xs bg-blue-600 text-white p-1 rounded-lg gap-1 hover:bg-blue-800"
        //             >
        //                 <LuPenLine /> Edit
        //             </button> */}
        //             <button
        //                 onClick={() => handleDeleteClick(category.id)}
        //                 className="py-1 px-2 flex items-center text-xs bg-red-600 text-white p-1 rounded-lg gap-1 hover:bg-red-800"
        //             >
        //                 <LuTrash2 /> Delete
        //             </button>
        //         </div>
        //     ),
        // },
    ];

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                    <div className="relative w-full md:w-auto">
                        {isLoading ? (
                            <div className="animate-pulse h-10 w-full bg-gray-300 rounded-lg"></div>
                        ) : (
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="py-3 pr-10 pl-4 shadow-sm border border-gray-300 rounded-lg text-sm focus:border-gray-800 focus:outline-none appearance-none w-full"
                            >
                                {[5, 10, 15, 20, 25].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        )}
                        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                            <RiArrowDownLine />
                        </span>
                    </div>

                    <div className="relative max-w-xs w-full">
                        <label htmlFor="search" className="sr-only">Search</label>
                        {isLoading ? (
                            <div className="animate-pulse h-10 w-full bg-gray-300 rounded-lg"></div>
                        ) : (
                            <input
                                id="search"
                                type="text"
                                className="py-3 px-4 ps-9 w-full shadow-sm border border-gray-300 rounded-lg text-sm focus:border-gray-800 focus:outline-none"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        )}
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                            <GoSearch />
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 mt-4 justify-end">
                    {/* <AddNews mutate={mutate} /> */}
                </div>
            </div>

            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    {[...Array(itemsPerPage)].map((_, index) => (
                        <div key={index} className="h-10 bg-gray-300 rounded-lg"></div>
                    ))}
                </div>
            ) : (
                <DataTable
                    data={currentCategories}
                    columns={columns}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                />
            )}

            {/* <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteCategory}
                message="Are you sure you want to delete this application?"
            /> */}

            {/* {updateModalOpen && (
                <UpdateNews
                    initialData={categoryToUpdate!}
                    onClose={closeUpdateModal}
                    mutate={mutate}
                />
            )} */}
        </div>
    );
};

export default CareerTable;