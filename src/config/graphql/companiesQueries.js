import { gql } from '@apollo/client';

export const GET_COMPANIES = gql`
  query GetCompanies($limit: Int, $offset: Int, $keyword: String) {
    companies(limit: $limit, offset: $offset, keyword: $keyword) {
      items {
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
      totalCount
    }
  }
`;


export const GET_COMPANY = gql`
  query GetCompany($id: Int!) {
    company(id: $id) {
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
      customers {
        id
        first_name
        last_name
        full_name
        email
        phone
        shopifyId
      }
    }
  }
`;

export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
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
  }
`;

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: Int!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) {
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
  }
`;

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: Int!) {
    deleteCompany(id: $id) {
      id
      name
    }
  }
`;
