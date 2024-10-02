import React, {useState, useEffect, useContext} from 'react';
import PageHeader from "../../components/common/pageHeader";
import DataTable from "../../components/common/dataTable";
import DataTablePagination from "../../components/common/dataTablePagination";
import {useMutation, useQuery} from '@apollo/client';
import DataTableSearch from "../../components/common/dataTableSearch";

import _ from 'lodash';
import Swal from "sweetalert2";
import {AuthContext} from "../../context/authContext";
import {DELETE_COMPANY, GET_COMPANIES} from "../../config/graphql/companiesQueries";

function Companies() {
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

  const {loading, error, data, refetch} = useQuery(GET_COMPANIES, {
    variables: {limit: defaultPageSize, offset, keyword: debouncedKeyword},
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      if(error.networkError.statusCode === 403){
        Swal.fire({
          icon: 'error',
          html: `You are not authorized to view companies.`,
          showConfirmButton: false,
          timer: 2000,
        });
        logout();
      }
    }
  });

  const [deleteCompany, {loading: deleteLoading, error: deleteError}] = useMutation(DELETE_COMPANY, {
    onCompleted: () => {
      refetch({limit: defaultPageSize, offset, keyword: debouncedKeyword});
      Swal.fire({
        icon: 'success',
        title: 'Company deleted successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
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

  const handleDelete = (id, name = "") => {
    Swal.fire({
      html: `Are you sure to deleting <b>${name}</b>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCompany({
          variables: {id},
        })
      }
    });
  }

  const totalCount = data?.companies?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / defaultPageSize);
  const lastItemIndex = Math.min(page * defaultPageSize, totalCount);

  useEffect(() => {
    refetch({limit: defaultPageSize, offset, keyword: debouncedKeyword});
  }, [page, debouncedKeyword, refetch, defaultPageSize, offset]);

  const headers = [
    {name: 'ID', key: 'id'},
    {name: 'Name', key: 'name'},
    {name: 'Email', key: 'email'},
    {name: 'Phone', key: 'phone'},
    {name: 'Address1', key: 'address1'},
    {name: 'Address2', key: 'address2'},
    {name: 'City', key: 'city'},
    {name: 'Province', key: 'province'},
    {name: 'Zip', key: 'zip'},
    {name: 'Country', key: 'country'},
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader name={"companies"} subtitle={"Manage your companies data."} route={`company`}/>

      <DataTableSearch value={keyword} onChange={handleSearchChange}/>

      {error && <p className="text-red-500">Error fetching companies: {error.message}</p>}

      {loading && <p>Loading...</p>}

      {data && data.companies && data.companies.items.length > 0 ? (
        <>
          <DataTable
            items={data.companies.items}
            headers={headers}
            route={`company`}
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
        !loading && <p>No companies found.</p>
      )}

    </div>
  );
}

export default Companies;
