import React, {useState, useEffect, useContext} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useQuery, useMutation} from '@apollo/client';
import {GET_CUSTOMER, CREATE_CUSTOMER, UPDATE_CUSTOMER} from "../../config/graphql/customerQueries";
import {GET_COMPANIES} from "../../config/graphql/companiesQueries";
import Spinner from "../../components/common/spinner";
import Swal from "sweetalert2";
import {AuthContext} from "../../context/authContext";
import _ from "lodash";

function CustomerForm() {
  const {logout} = useContext(AuthContext);

  const navigate = useNavigate();
  const {id} = useParams();
  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    shopifyId: '',
    companyId: '',
  });

  const {data: customerData, loading: customerLoading, error: customerError} = useQuery(GET_CUSTOMER, {
    variables: {id: parseInt(id)},
    skip: !isEditMode, // Skip this query if not in edit mode
    onError: (error) => {
      if (error.networkError.statusCode === 403) {
        console.error("You are not authorized to view customers.");
        logout();
      }
    }
  });

  const {data: companiesData, loading: companiesLoading, error: companiesError} = useQuery(GET_COMPANIES);

  const [createCustomer, {loading: createLoading, error: createError}] = useMutation(CREATE_CUSTOMER);
  const [updateCustomer, {loading: updateLoading, error: updateError}] = useMutation(UPDATE_CUSTOMER);

  useEffect(() => {
    if (isEditMode && customerData) {
      setFormData({
        full_name: customerData.customer.full_name || '',
        first_name: customerData.customer.first_name || '',
        last_name: customerData.customer.last_name || '',
        email: customerData.customer.email || '',
        phone: customerData.customer.phone || '',
        shopifyId: customerData.customer.shopifyId || '',
        companyId: customerData.customer.company?.id || '',
      });
    }
  }, [isEditMode, customerData]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name.trim()) {
      Swal.fire({
        icon: "error",
        title: `First name is required.`,
      });
      return;
    }
    if (!formData.last_name.trim()) {
      Swal.fire({
        icon: "error",
        title: `Last name is required.`,
      });
      return;
    }
    if (!formData.companyId || !_.isNumber(parseInt(formData.companyId))) {
      Swal.fire({
        icon: "error",
        title: `Company is required.`,
      });
      return;
    }
    if (!formData.email.trim()) {
      Swal.fire({
        icon: "error",
        title: `Email is required.`,
      });
      return;
    }

    try {
      if (isEditMode) {
        await updateCustomer({
          variables: {
            id: parseInt(id),
            input: {
              ...formData,
              companyId: formData.companyId ? parseInt(formData.companyId) : null,
            },
          },
        }).then(() => {
          Swal.fire({
            icon: "success",
            title: "Customer updated successfully!",
            showConfirmButton: false,
            timer: 1500
          });
        });
      } else {
        console.log("formData:", formData);

        await createCustomer({
          variables: {
            input: {
              ...formData,
              companyId: formData.companyId ? parseInt(formData.companyId) : null,
            },
          },
        }).then(() => {
          Swal.fire({
            icon: "success",
            title: 'Customer created successfully!',
            showConfirmButton: false,
            timer: 2000
          });
        });
      }
      navigate('/customers'); // Redirect to the customers list
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: "error",
        title: `${error.message}`,
      });
    }
  };

  const handleReset = () => {
    if (isEditMode && customerData) {
      setFormData({
        first_name: customerData.customer.first_name || '',
        last_name: customerData.customer.last_name || '',
        full_name: customerData.customer.full_name || '',
        email: customerData.customer.email || '',
        phone: customerData.customer.phone || '',
        shopifyId: customerData.customer.shopifyId || '',
        companyId: customerData.customer.company?.id || '',
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        full_name: '',
        email: '',
        phone: '',
        shopifyId: '',
        companyId: '',
      });
    }
  };

  if (isEditMode && customerLoading) return <Spinner/>;
  if (companiesLoading) return <Spinner/>;

  if (isEditMode && customerError) return <p>Error loading customer data: {customerError.message}</p>;
  if (companiesError) return <p>Error loading companies: {companiesError.message}</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Customer' : 'Create New Customer'}</h2>

      {
        createError && (
          <p className="text-red-500">Error creating customer: {createError.message}</p>
        )
      }
      {
        updateError && (
          <p className="text-red-500">Error updating customer: {updateError.message}</p>
        )
      }

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            First name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            required
            value={formData.first_name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter customer first name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Last name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            required
            value={formData.last_name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter customer last name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full name
          </label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            required
            value={formData.full_name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter customer full name"
          />
        </div>

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
            placeholder="Enter customer email"
          />
        </div>

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
            placeholder="Enter customer phone number"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="shopifyId" className="block text-sm font-medium text-gray-700">
            Shopify ID
          </label>
          <input
            disabled={!isEditMode}
            type="text"
            name="shopifyId"
            id="shopifyId"
            value={formData.shopifyId}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter Shopify ID"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <select
            name="companyId"
            id="companyId"
            value={formData.companyId}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a company</option>
            {companiesData.companies.items.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

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
            {isEditMode ? (updateLoading ? 'Updating...' : 'Update Customer') : (createLoading ? 'Creating...' : 'Create Customer')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
