import React, {useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useQuery, useMutation} from '@apollo/client';
import {DELETE_COMPANY, GET_COMPANY} from '../../config/graphql/companiesQueries';
import Swal from 'sweetalert2';
import Spinner from "../../components/common/spinner";
import {AuthContext} from "../../context/authContext";

function CompanyView() {
  const {logout} = useContext(AuthContext);

  const {id} = useParams();
  const navigate = useNavigate();
  const companyId = parseInt(id);

  // Fetch company data with associated customers
  const {
    data: companyData,
    loading: companyLoading,
    error: companyError,
  } = useQuery(GET_COMPANY, {
    variables: {id: companyId},
    onError: (error) => {
      if (error.networkError.statusCode === 403) {
        console.error("You are not authorized to view company.");
        logout();
      }
    }
  });

  // Define delete mutation
  const [deleteCompany, {loading: deleteLoading, error: deleteError}] = useMutation(DELETE_COMPANY, {
    variables: {id: companyId},
    refetchQueries: ['GetCompanies'], // Refetch companies list after deletion
    onCompleted: () => {
      Swal.fire({
        icon: 'success',
        title: 'Company deleted successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate('/companies');
    },
    onError: (error) => {
      console.error("Error deleting company:", error);
      Swal.fire({
        icon: 'error',
        html: `${error.message}`,
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });

  const handleDelete = () => {
    Swal.fire({
      html: `Are you sure to deleting <b>${companyData.company.name}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCompany({
          variables: {id: companyId},
        });
      }
    });
  };

  // Show spinner while loading
  if (companyLoading) return <Spinner/>;

  // Show error if there's an error fetching company data
  if (companyError)
    return <p className="text-red-500">Error loading company data: {companyError.message}</p>;

  const company = companyData.company;

  return (
    <div className="mx-auto bg-white p-8 shadow-md rounded-md mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{company.name}</h2>
        <div className="flex space-x-4">
          <a
            href={`/company/form/${id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit
          </a>
          <button
            onClick={handleDelete}
            disabled={deleteLoading || !company.customers}
            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
              deleteLoading || !company.customers ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Company Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Information</h3>
          <p><span className="font-medium">Email:</span> {company.email}</p>
          <p><span className="font-medium">Phone:</span> {company.phone || 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Address</h3>
          <p>{company.address1 || 'N/A'}</p>
          {
            company.address2 ? <p>{company.address2}</p> : null
          }
          <p>{company.city || 'N/A'}, {company.province || 'N/A'} {company.zip || 'N/A'}</p>
          <p>{company.country || 'N/A'}</p>
        </div>
      </div>

      {/* Associated Customers */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Associated Customers</h3>
        {company.customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
              <tr>
                <th
                  className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th
                  className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th
                  className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th
                  className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th
                  className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shopify ID
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
              </tr>
              </thead>
              <tbody>
              {company.customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {customer.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {customer.first_name} {customer.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {customer.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {customer.shopifyId || 'N/A'}
                  </td>

                  {/*View Customer Button */}
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-right text-sm font-medium">
                    <a
                      href={`/customer/view/${customer.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No customers associated with this company.</p>
        )}
      </div>
    </div>
  );
}

export default CompanyView;
