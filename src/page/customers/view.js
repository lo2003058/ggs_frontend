// src/pages/customers/CustomerView.js

import React, { useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/authContext';
import { DELETE_CUSTOMER, GET_CUSTOMER } from '../../config/graphql/customerQueries';
import Spinner from '../../components/common/spinner';
import moment from 'moment'; // Import Moment.js

function CustomerView() {
  const { logout } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const customerId = parseInt(id);

  const {
    data: customerData,
    loading: customerLoading,
    error: customerError,
  } = useQuery(GET_CUSTOMER, {
    variables: { id: customerId },
    onError: (error) => {
      if (error.networkError?.statusCode === 403) {
        console.error('You are not authorized to view customers.');
        logout();
      }
    },
  });

  // Define delete mutation
  const [deleteCustomer, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_CUSTOMER, {
    variables: { id: customerId },
    refetchQueries: ['GetCustomers'], // Refetch customers list after deletion
    onCompleted: () => {
      Swal.fire({
        icon: 'success',
        title: 'Customer deleted successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate('/customers');
    },
    onError: (error) => {
      console.error('Error deleting customer:', error);
      Swal.fire({
        icon: 'error',
        html: `${error.message}`,
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });

  const handleDelete = () => {
    // Determine the display name
    const displayName = customerData.customer.full_name
      ? customerData.customer.full_name
      : `${customerData.customer.first_name} ${customerData.customer.last_name}`;

    Swal.fire({
      html: `Are you sure you want to delete <b>${displayName}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCustomer();
      }
    });
  };

  if (customerLoading) return <Spinner />;

  if (customerError)
    return <p className="text-red-500">Error loading customer data: {customerError.message}</p>;

  const customer = customerData.customer;

  const formatDate = (date) => {
    return moment(date).isValid() ? moment(date).format('DD/MM/YYYY HH:mm:ss') : 'N/A';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-md mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Customer Details</h2>
        <div className="flex space-x-4">
          <Link
            to={`/customer/form/${id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
              deleteLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Display Mutation Errors */}
      {deleteError && (
        <p className="text-red-500 mb-4">Error deleting customer: {deleteError.message}</p>
      )}

      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Information</h3>
          <p>
            <span className="font-medium">First Name:</span> {customer.first_name}
          </p>
          <p>
            <span className="font-medium">Last Name:</span> {customer.last_name}
          </p>
          <p>
            <span className="font-medium">Full Name:</span> {customer.full_name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {customer.email}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {customer.phone || 'N/A'}
          </p>
          <p>
            <span className="font-medium">Shopify ID:</span> {customer.shopifyId || 'N/A'}
          </p>
        </div>

        {/* Company Information */}
        {customer.company && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Company Information</h3>
            <p>
              <span className="font-medium">Company Name:</span>{' '}
              <Link
                to={`/company/view/${customer.company.id}`}
                className="text-indigo-600 hover:text-indigo-900"
              >
                {customer.company.name}
              </Link>
            </p>
            <p>
              <span className="font-medium">Email:</span> {customer.company.email || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {customer.company.phone || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Address1:</span> {customer.company.address1 || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Address2:</span> {customer.company.address2 || 'N/A'}
            </p>
            <p>
              <span className="font-medium">City:</span> {customer.company.city || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Province:</span> {customer.company.province || 'N/A'}
            </p>
            <p>
              <span className="font-medium">ZIP Code:</span> {customer.company.zip || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Country:</span> {customer.company.country || 'N/A'}
            </p>
          </div>
        )}
      </div>

      {/* Shopify Information */}
      {
        customer.shopifyData && (
          <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Shopify Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shopify Personal Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Shopify Personal Details</h4>
              <p>
                <span className="font-medium">Shopify ID:</span> {customer.shopifyData.id}
              </p>
              <p>
                <span className="font-medium">First Name:</span> {customer.shopifyData.firstName}
              </p>
              <p>
                <span className="font-medium">Last Name:</span> {customer.shopifyData.lastName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {customer.shopifyData.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {customer.shopifyData.phone || 'N/A'}
              </p>
            </div>

            {/* Shopify Address Information */}
            {customer.shopifyData.defaultAddress && (
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Shopify Default Address</h4>
                <p>
                  <span className="font-medium">Address ID:</span> {customer.shopifyData.defaultAddress.id}
                </p>
                <p>
                  <span className="font-medium">First Name:</span> {customer.shopifyData.defaultAddress.firstName}
                </p>
                <p>
                  <span className="font-medium">Last Name:</span> {customer.shopifyData.defaultAddress.lastName}
                </p>
                <p>
                  <span className="font-medium">Address1:</span> {customer.shopifyData.defaultAddress.address1 || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Address2:</span> {customer.shopifyData.defaultAddress.address2 || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">City:</span> {customer.shopifyData.defaultAddress.city || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Company:</span> {customer.shopifyData.defaultAddress.company || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Province:</span> {customer.shopifyData.defaultAddress.province || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">ZIP Code:</span> {customer.shopifyData.defaultAddress.zip || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Country:</span> {customer.shopifyData.defaultAddress.country || 'N/A'}
                </p>
              </div>
            )}
          </div>

          {/* Shopify Dates */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Shopify Dates</h4>
            <p>
              <span className="font-medium">Created At:</span>{' '}
              {formatDate(customer.shopifyData.createdAt)}
            </p>
            <p>
              <span className="font-medium">Updated At:</span>{' '}
              {formatDate(customer.shopifyData.updatedAt)}
            </p>
          </div>
        </div>
        )
      }
    </div>
  );
}

export default CustomerView;
