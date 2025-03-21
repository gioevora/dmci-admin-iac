import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import BtnLoadingSpinner from '@/app/components/spinner';
import FormikCustomErrorMsg from '@/app/components/formik-custom-error-msg';
import DataTable from '@/app/components/matt/DataTable';


interface PropertyDetailsContentProps {
    id: string | null;
}

interface Unit {
    id: string;
    type: string;
    area: string;
    price: number;
    status: string;
}

interface AddUnit {
    type: string;
    area: string;
    price: number;
    status: string;
}

const PropertyUnits: React.FC<PropertyDetailsContentProps> = ({ id }) => {
    const [unitData, setUnitData] = useState<Unit[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isLoading1, setLoading1] = useState<boolean>(false);
    const [isLoading2, setLoading2] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [unitToDelete, setUnitToDelete] = useState<string | null>(null);

    const fetchUnitData = async () => {
        const token = sessionStorage.getItem('token');
        setLoading(true);
        setError(null);

        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`, { headers });
            setUnitData(response.data.record.units || []);
        } catch (err) {
            setError('Failed to load unit data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUnit = async (values: AddUnit) => {
        if (!id) {
            alert('Property ID is required to add a unit.');
            return;
        }

        setLoading1(true);

        const unitPayload = { ...values, property_id: id };

        try {
            const token = sessionStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/units`, unitPayload, { headers });
            toast.success("Unit added successfully!");
            setModalOpen(false);
            await fetchUnitData();
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading1(false);
            setModalOpen(false);
        }
    };

    const handleDeleteUnit = async () => {
        if (!unitToDelete) return;
        setLoading2(true);
        try {
            const token = sessionStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/units/${unitToDelete}`, { headers });
            toast.success("Unit deleted successfully!");
            setDeleteModalOpen(false);
            setLoading2(false);
            await fetchUnitData();
        } catch (err) {
            toast.error("Failed to delete unit.");
        } finally {
            setLoading2(false);
            setDeleteModalOpen(false);
            setUnitToDelete(null);
        }
    };

    const formik = useFormik({
        initialValues: {
            type: '',
            area: '',
            price: 0,
            status: '',
        },
        validationSchema: Yup.object({
            type: Yup.string().required('Unit type is required'),
            area: Yup.number().required('Unit area is required').positive().integer(),
            price: Yup.number().required('Price is required').positive(),
            status: Yup.string().required('Status is required'),
        }),
        onSubmit: (values) => {
            handleAddUnit(values);
        },
    });

    useEffect(() => {
        fetchUnitData();
    }, [id]);

    const columns = [
        { key: 'type', header: 'Unit' },
        {
            key: 'area', header: 'Area', renderCell: (row: Unit) => (
                <span>{row.area} sqm</span>
            ),
        },
        {
            key: 'price',
            header: 'Price',
            renderCell: (row: Unit) => {
                const price = Number(row.price) || 0;
                return <span>₱{price.toFixed(2)}</span>;
            }
        },

        { key: 'status', header: 'Status' },
        {
            key: 'actions', header: 'Actions', renderCell: (row: Unit) => (
                <button onClick={() => { setUnitToDelete(row.id); setDeleteModalOpen(true); }}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Delete
                </button>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form onSubmit={formik.handleSubmit}>
                <div className="col-span-1">
                    <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-lg p-4 md:p-5">
                        <div className="w-full mb-3">
                            <label htmlFor="type" className="block text-sm font-medium mb-2">
                                Unit Type
                            </label>
                            <select
                                name="type"
                                className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select Unit Type</option>
                                <option value="1 Bedroom">1 Bedroom</option>
                                <option value="2 Bedroom">2 Bedroom</option>
                                <option value="3 Bedroom">3 Bedroom</option>
                                <option value="Loft">Loft</option>
                                <option value="Studio">Studio</option>
                            </select>
                            {formik.touched.type && formik.errors.type && (
                                <FormikCustomErrorMsg>{formik.errors.type}</FormikCustomErrorMsg>
                            )}
                        </div>

                        <div className="w-full mb-3">
                            <label htmlFor="area" className="block text-sm font-medium mb-2">
                                Unit Area (sqm)
                            </label>
                            <input
                                type="text"
                                name="area"
                                className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="e.g., 45"
                                value={formik.values.area}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.area && formik.errors.area && (
                                <FormikCustomErrorMsg>{formik.errors.area}</FormikCustomErrorMsg>
                            )}
                        </div>

                        <div className="w-full mb-3">
                            <label htmlFor="price" className="block text-sm font-medium mb-2">
                                Price
                            </label>
                            <input
                                type="text"
                                name="price"
                                className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="e.g., 1000000"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.price && formik.errors.price && (
                                <FormikCustomErrorMsg>{formik.errors.price}</FormikCustomErrorMsg>
                            )}
                        </div>

                        <div className="w-full mb-3">
                            <label htmlFor="status" className="block text-sm font-medium mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select Status</option>
                                <option value="Available">Available</option>
                                <option value="Not Available">Not Available</option>
                            </select>
                            {formik.touched.status && formik.errors.status && (
                                <FormikCustomErrorMsg>{formik.errors.status}</FormikCustomErrorMsg>
                            )}
                        </div>

                        <div className="w-full">
                            <button
                                type="submit"
                                className={`w-full py-2 px-3 min-h-10 inline-flex items-center justify-center text-sm font-medium rounded-lg text-white focus:outline-none ${isLoading1 ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                disabled={isLoading1}
                            >
                                {isLoading1 ? <BtnLoadingSpinner /> : 'Add Unit'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-medium mb-4">Confirm Add</h2>
                        <p>Are you sure you want to add this unit?</p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="min-w-[100px] py-2 px-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`min-w-[100px] py-2 px-3 text-sm font-medium text-white rounded-lg ${isLoading1 ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                onClick={() => formik.submitForm()}
                                disabled={isLoading1}
                            >
                                {isLoading1 ? <BtnLoadingSpinner /> : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-medium mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this unit?</p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="min-w-[100px] py-2 px-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                                onClick={() => setDeleteModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`min-w-[100px] py-2 px-3 text-sm font-medium text-white rounded-lg ${isLoading2 ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}
                                onClick={handleDeleteUnit}
                                disabled={isLoading2}
                            >
                                {isLoading2 ? <BtnLoadingSpinner /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="col-span-2">
                <div className="flex flex-col">
                    <div className="overflow-x-auto">
                        <div className="border rounded-lg shadow">
                            <DataTable columns={columns} data={unitData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PropertyUnits;