import { gql } from '@apollo/client';

export const GET_CUSTOMERS = gql`
  query GetCustomers($limit: Int, $offset: Int, $keyword: String) {
    customers(limit: $limit, offset: $offset, keyword: $keyword) {
      items {
        id
        first_name
        last_name
        full_name
        email
        phone
        shopifyId
        company {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer($id: Int!) {
    customer(id: $id) {
      id
      first_name
      last_name
      full_name
      email
      phone
      shopifyId
      company {
        id
        name
        email
        phone
        address1
        address2
        city
        province
        zip
        country
      }
      shopifyData {
        id
        firstName
        lastName
        email
        phone
        defaultAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          company
          province
          zip
          country
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      first_name
      last_name
      full_name
      email
      phone
      shopifyId
      company {
        id
        name
      }
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: Int!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      first_name
      last_name
      full_name
      email
      phone
      shopifyId
      company {
        id
        name
      }
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: Int!) {
    deleteCustomer(id: $id) {
      id
      first_name
      last_name
      full_name
    }
  }
`;
