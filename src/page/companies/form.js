import React, {useState, useEffect, useContext} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useQuery, useMutation} from '@apollo/client';

import Swal from 'sweetalert2';
import {CREATE_COMPANY, GET_COMPANY, UPDATE_COMPANY} from "../../config/graphql/companiesQueries";
import Spinner from "../../components/common/spinner";
import {AuthContext} from "../../context/authContext";

function CompanyForm() {
  const {logout} = useContext(AuthContext);

  const navigate = useNavigate();
  const {id} = useParams();
  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: '',
  });

  // Fetch existing company data if in edit mode
  const {
    data: companyData,
    loading: companyLoading,
    error: companyError,
  } = useQuery(GET_COMPANY, {
    variables: {id: parseInt(id)},
    skip: !isEditMode, // Skip this query if not in edit mode
    onError: (error) => {
      if(error.networkError.statusCode === 403){
        console.error("You are not authorized to view customers.");
        logout();
      }
    }
  });

  // Define mutations
  const [createCompany, {loading: createLoading, error: createError}] =
    useMutation(CREATE_COMPANY);
  const [updateCompany, {loading: updateLoading, error: updateError}] =
    useMutation(UPDATE_COMPANY);

  // Populate form data when editing
  useEffect(() => {
    if (isEditMode && companyData) {
      setFormData({
        name: companyData.company.name || '',
        email: companyData.company.email || '',
        phone: companyData.company.phone || '',
        address1: companyData.company.address1 || '',
        address2: companyData.company.address2 || '',
        city: companyData.company.city || '',
        province: companyData.company.province || '',
        zip: companyData.company.zip || '',
        country: companyData.company.country || '',
      });
    }
  }, [isEditMode, companyData]);

  // Handle form field changes
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Name is required.',
      });
      return;
    }
    if (!formData.email.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Email is required.',
      });
      return;
    }

    try {
      if (isEditMode) {
        await updateCompany({
          variables: {
            id: parseInt(id),
            input: {
              ...formData,
            },
          },
        }).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Company updated successfully!',
            showConfirmButton: false,
            timer: 1500,
          });
        });
      } else {
        await createCompany({
          variables: {
            input: {
              ...formData,
            },
          },
        }).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Company created successfully!',
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
      navigate('/companies');
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: 'error',
        title: `Error: ${error.message}`,
      });
    }
  };

  // Handle form reset
  const handleReset = () => {
    if (isEditMode && companyData) {
      setFormData({
        name: companyData.company.name || '',
        email: companyData.company.email || '',
        phone: companyData.company.phone || '',
        address1: companyData.company.address1 || '',
        address2: companyData.company.address2 || '',
        city: companyData.company.city || '',
        province: companyData.company.province || '',
        zip: companyData.company.zip || '',
        country: companyData.company.country || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address1: '',
        address2: '',
        city: '',
        province: '',
        zip: '',
        country: '',
      });
    }
  };

  // Show spinner while loading company data
  if (isEditMode && companyLoading) return <Spinner/>;

  // Show error if there's an error fetching company data
  if (isEditMode && companyError)
    return <p className="text-red-500">Error loading company data: {companyError.message}</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Company' : 'Create New Company'}
      </h2>

      {/* Display Mutation Errors */}
      {createError && (
        <p className="text-red-500 mb-4">Error creating company: {createError.message}</p>
      )}
      {updateError && (
        <p className="text-red-500 mb-4">Error updating company: {updateError.message}</p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter company name"
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter company email"
          />
        </div>

        {/* Phone Field */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter company phone number"
          />
        </div>

        {/* Address Field */}
        <div className="mb-4">
          <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
            Address1
          </label>
          <input
            type="text"
            name="address1"
            id="address1"
            value={formData.address1}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter company address1"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
            Address2
          </label>
          <input
            type="text"
            name="address2"
            id="address2"
            value={formData.address2}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter company address2"
          />
        </div>

        {/* City Field */}
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            name="city"
            id="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter city"
          />
        </div>

        {/* Province Field */}
        <div className="mb-4">
          <label htmlFor="province" className="block text-sm font-medium text-gray-700">
            Province
          </label>
          <input
            type="text"
            name="province"
            id="province"
            value={formData.province}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter province"
          />
        </div>

        {/* ZIP Code Field */}
        <div className="mb-4">
          <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
            ZIP Code
          </label>
          <input
            type="text"
            name="zip"
            id="zip"
            value={formData.zip}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter ZIP code"
          />
        </div>

        {/* Country Field */}
        <div className="mb-6">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            name="country"
            id="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter country"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={createLoading || updateLoading}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
              createLoading || updateLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isEditMode
              ? updateLoading
                ? 'Updating...'
                : 'Update Company'
              : createLoading
                ? 'Creating...'
                : 'Create Company'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CompanyForm;
