import React, {useState, useEffect, useContext} from 'react';
import PageHeader from "../../components/common/pageHeader";
import DataTable from "../../components/common/dataTable";
import DataTablePagination from "../../components/common/dataTablePagination";
import {useMutation, useQuery} from '@apollo/client';
import DataTableSearch from "../../components/common/dataTableSearch";
import {DELETE_CUSTOMER, GET_CUSTOMERS} from "../../config/graphql/customerQueries";

import _ from 'lodash';
import Swal from "sweetalert2";
import {AuthContext} from "../../context/authContext";

export default function Customers() {
  const {logout} = useContext(AuthContext);

  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const defaultPageSize = 10;
  const offset = (page - 1) * defaultPageSize;

  // Debounce the keyword input to prevent excessive queries
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const debounceSearch = _.debounce((value) => {
    setDebouncedKeyword(value);
    setPage(1); // Reset to first page when keyword changes
  }, 500);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    debounceSearch(value);
  };

  const {loading, error, data, refetch} = useQuery(GET_CUSTOMERS, {
    variables: {limit: defaultPageSize, offset, keyword: debouncedKeyword},
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      if(error.networkError.statusCode === 403){
        Swal.fire({
          icon: 'error',
          html: `You are not authorized to view customers.`,
          showConfirmButton: false,
          timer: 2000,
        });
        logout();
      }
    }
  });

  const [deleteCustomer, {loading: deleteLoading, error: deleteError}] = useMutation(DELETE_CUSTOMER, {
    onCompleted: () => {
      refetch({limit: defaultPageSize, offset, keyword: debouncedKeyword});
      Swal.fire({
        title: "Deleted!",
        html: "Record has been deleted.",
        icon: "success"
      });
    },
    onError: (error) => {
      console.error("Error deleting customer:", error);
      Swal.fire({
        icon: 'error',
        html: `${error.message}`,
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });

  const handleDelete = (id, name = "") => {
    Swal.fire({
      html: `Are you sure to delete <b>${name}</b>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCustomer({
          variables: {id},
        })
      }
    });
  }

  const totalCount = data?.customers?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / defaultPageSize);
  const lastItemIndex = Math.min(page * defaultPageSize, totalCount);

  useEffect(() => {
    refetch({limit: defaultPageSize, offset, keyword: debouncedKeyword});
  }, [page, debouncedKeyword, refetch, defaultPageSize, offset]);

  const headers = [
    {name: 'ID', key: 'id'},
    {name: 'Full name', key: 'full_name'},
    {name: 'First name', key: 'first_name'},
    {name: 'Last name', key: 'last_name'},
    {name: 'Phone', key: 'phone'},
    {name: 'Shopify ID', key: 'shopifyId'},
    {name: 'Company', key: 'company.name'},
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader name="Customers" subtitle="Manage your customers." route="customer"/>

      <DataTableSearch value={keyword} onChange={handleSearchChange}/>

      {error && <p className="text-red-500">Error fetching customers: {error.message}</p>}

      {loading && <p>Loading...</p>}

      {data && data.customers && data.customers.items.length > 0 ? (
        <>
          <DataTable
            items={data.customers.items}
            headers={headers}
            route={`customer`}
            onDelete={handleDelete}
            isShowViewButton
          />
          <DataTablePagination
            currentPage={page}
            firstItemIndex={offset + 1}
            lastItemIndex={lastItemIndex}
            totalResults={totalCount}
            pageSize={defaultPageSize}
            onPrevPageClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            onNextPageClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          />
        </>
      ) : (
        !loading && <p>No customers found.</p>
      )}
    </div>
  );
}
