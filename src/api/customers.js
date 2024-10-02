import axiosInstance from "../config/axiosConfig";

export const getAllCustomers = async () => {
  const response = await axiosInstance.get('/customers');
  return response.data;
};

export const getCustomerById = async (id) => {
  const response = await axiosInstance.get(`/customers/${id}`);
  return response.data;
}

export const createCustomer = async (customer) => {
  const response = await axiosInstance.post('/customers', customer);
  return response.data;
}

export const updateCustomer = async (id, customer) => {
  const response = await axiosInstance.put(`/customers/${id}`, customer);
  return response.data;
}

export const deleteCustomer = async (id) => {
  const response = await axiosInstance.delete(`/customers/${id}`);
  return response.data;
}
