import React, { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import axios, { AxiosError } from "axios";
import { RiArrowDownLine } from "react-icons/ri";
import toast from "react-hot-toast";
import BtnLoadingSpinner from "@/app/components/spinner";

interface AddPropertyProps {
  mutate?: () => void;
}

const AddProperty: React.FC<AddPropertyProps> = ({ mutate }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  let user_id;

  if (typeof window !== "undefined" && window.sessionStorage) {
    user_id = sessionStorage.getItem("user_id");
  } else {
    user_id = null;
  }
  let accessToken;

  if (typeof window !== "undefined" && window.sessionStorage) {
    accessToken = sessionStorage.getItem("token");
  } else {
    accessToken = null;
  }

  const [formData, setFormData] = useState<{ [key: string]: any }>({
    user_id: user_id,
    name: "",
    logo: null,
    slogan: "",
    description: "",
    location: "",
    min_price: "",
    max_price: "",
    status: "",
    percent: "",
    images: [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        if (name === "logo") {
          setFormData((prev) => ({
            ...prev,
            logo: files[0],
          }));
        } else if (name === "images") {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...Array.from(files)],
          }));
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseInt(value, 10) : value,
      }));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file) => data.append("images[]", file));
        } else if (key === "logo" && value) {
          data.append("logo", value);
        } else {
          data.append(key, value);
        }
      });

      let property = {};

      const postResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties`,
        data,
        { headers }
      );

      if (postResponse?.data) {
        setFormData({
          name: "",
          logo: "",
          slogan: "",
          description: "",
          location: "",
          min_price: "",
          max_price: "",
          status: "",
          percent: "",
          image: [],
        });
        mutate?.();
        setModalOpen(false);
        toast.success("Property added successfully!");

        property = postResponse.data.record;
      }

      let subscribers: any[] = [];

      const getResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subscribers`,
        { headers }
      );

      if (getResponse.data) {
        subscribers = getResponse.data.records;
      }

      if (property && subscribers) {
        const response = await axios.post(`/api/email/property/submit`, {
          property: property,
          subscribers: subscribers,
        });

        console.log("Email response: success" + response);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMsg =
        axiosError.response?.data &&
        typeof axiosError.response.data === "object"
          ? (axiosError.response.data as any).message
          : "An unexpected error occurred.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="min-w-[150px] py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        aria-label="Add news and updates"
        onClick={() => setModalOpen(true)}
      >
        <IoAddCircleOutline className="h-6 w-6" /> Add property
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
        >
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
            <form onSubmit={handleAddSubmit} encType="multipart/form-data">
              <div className="flex justify-between items-center py-3 px-4 border-b">
                <h3
                  id="hs-large-modal-label"
                  className="font-bold text-gray-800 uppercase"
                >
                  Add Property
                </h3>
              </div>
              <div className="p-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label
                      htmlFor="input-label"
                      className="block text-sm font-medium mb-2"
                    >
                      Property Name
                    </label>
                    <input
                      type="hidden"
                      name="user_id"
                      value={formData.user_id}
                    />
                    <input
                      type="text"
                      name="name"
                      className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Enter property name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="input-label"
                      className="block text-sm font-medium mb-2"
                    >
                      Property Status
                    </label>
                    <div className="relative">
                      <select
                        className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm appearance-none focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select Status
                        </option>
                        <option value="Under Construction">
                          Under Construction
                        </option>
                        <option value="Ready For Occupancy">
                          Ready For Occupancy
                        </option>
                        <option value="New">New</option>
                      </select>
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                        <RiArrowDownLine />
                      </span>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <label
                      htmlFor="input-label"
                      className="block text-sm font-medium mb-2"
                    >
                      Property Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Enter property location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="input-label"
                      className="block text-sm font-medium mb-2"
                    >
                      Property Progress(%)
                    </label>
                    <input
                      type="number"
                      name="percent"
                      className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Enter property percent"
                      value={formData.percent}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="input-label"
                      className="block text-sm font-medium mb-2"
                    >
                      Minimum Price
                    </label>
                    <input
                      type="number"
                      name="min_price"
                      className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Enter property min price"
                      value={formData.min_price}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="input-label"
                      className="block text-sm font-medium mb-2"
                    >
                      Maximum Price
                    </label>
                    <input
                      type="number"
                      name="max_price"
                      className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Enter property max price"
                      value={formData.max_price}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-4">
                    <label
                      htmlFor="input-label"
                      className="block text-sm font-medium mb-2"
                    >
                      Property Slogan
                    </label>
                    <input
                      type="text"
                      name="slogan"
                      className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Enter property slogan"
                      value={formData.slogan}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-4">
                    <label
                      htmlFor="input-label"
                      className="block text-sm font-medium mb-2"
                    >
                      Property Description
                    </label>
                    <textarea
                      name="description"
                      className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Enter property description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="input-label"
                      className="block text-sm font-medium mb-2"
                    >
                      Property Logo
                    </label>
                    <input
                      type="file"
                      name="logo"
                      className="block w-full text-sm text-gray-500
                                                             file:me-4 file:py-2 file:px-4
                                                             file:rounded-lg file:border-0
                                                             file:text-sm file:font-semibold
                                                             file:bg-blue-600 file:text-white
                                                             hover:file:bg-blue-700
                                                             file:disabled:opacity-50 file:disabled:pointer-events-none"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="input-label"
                      className="block text-sm font-medium mb-2"
                    >
                      Property Image
                    </label>
                    <input
                      type="file"
                      name="images"
                      multiple
                      className="block w-full text-sm text-gray-500
                                                                 file:me-4 file:py-2 file:px-4
                                                                 file:rounded-lg file:border-0
                                                                 file:text-sm file:font-semibold
                                                                 file:bg-blue-600 file:text-white
                                                                 hover:file:bg-blue-700
                                                                 file:disabled:opacity-50 file:disabled:pointer-events-none"
                      onChange={handleChange}
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
                  className={`min-w-24 min-h-10 py-2 px-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? "opacity-50 pointer-events-none" : ""}`}
                  disabled={loading}
                >
                  {loading ? <BtnLoadingSpinner /> : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProperty;
