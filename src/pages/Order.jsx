// CustomerMaster.jsx
import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import Navbar from './Navbar';
import { API_END_POINTS } from '../api';
import CustomTable from '../components/CustomTable';
import MultiSelectField from '../components/MultiSelectField';
import Swal from 'sweetalert2';
import formatDateToDDMMYYYY from '../components/helpers/dateFormat';
import Dropdown from '../components/dropdown';
const token = localStorage.getItem("token")

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    const res = await axios.get(API_END_POINTS.order.getAll,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    setOrders(res?.data || []);
  };

  const fetchCustomers = async () => {
    const res = await axios.get(API_END_POINTS.customer.getAll,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    setCustomers(res?.data || []);
  };

  const fetchSalesPersons = async () => {
    const res = await axios.get(API_END_POINTS.salesPerson.getAll,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    setSalesPersons(res?.data || []);   
  };

  useEffect(() => {
    fetchOrders()
    fetchCustomers();
    fetchSalesPersons();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try{
      // const payload = {
      //   ...values,
      //   salesPersonIds: values.salesPersonIds.map(id => ({
      //       ...id
      //     })),
      //   customerIds: values.customerIds.map(id => ({
      //       ...id
      //     }))
      // };
    if (selectedOrder) {
      await axios.put(API_END_POINTS.order.update, values,{
        params: {id:selectedOrder._id},
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
    } else {
      await axios.post(API_END_POINTS.order.create, values,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
    }
    fetchOrders();
    resetForm();
    setModalOpen(false);
    setSelectedOrder(null);
    
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: selectedOrder ? 'Order updated successfully' : 'Order created successfully',
    });
  }catch(error){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error?.response?.data?.message || 'Something went wrong. Please try again.',
    });
  }

  };

  const handleDelete = async (id) => {
    await axios.delete(API_END_POINTS.order.delete, {
      params:{id},
      headers:{
          Authorization:`Bearer ${token}`
      }
    });
    fetchOrders();
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const validationSchema = Yup.object({
    orderNo: Yup.string()
      .trim()
      .required('Customer No No is required')
      .matches(/^[a-zA-Z0-9-]+$/, 'Customer No can only contain letters, numbers, and hyphens')
      .min(3, 'Customer No must be at least 3 characters')
      .max(20, 'Customer No cannot exceed 20 characters'),
    orderDate: Yup.date()
      .required('Order Date is required')
      .typeError('Invalid date format'),
    orderAmount: Yup.string()
      .required('Order Amount is required')
      .matches(/^\d/g, "Only numbers allowed") 
      .typeError('Order Amount must be a number'),
    salesPersonIds: Yup.object().shape({
        salesPersId: Yup.string()
        .required('SalesPerson is required')
      }),
    customerIds: Yup.object().shape({
        custId: Yup.string()
          .required('Customer is required')
      }),     
  });

  const columns = [
    { title: 'Order No', key: 'orderNo' },
    { title: 'Order Date', key: 'orderDate' },
    { title: 'Order Amount', key: 'orderAmount' },
    { title: 'Customer Name', key: 'customerIds' },
    { title: 'Sales Persons', key : 'salesPersonIds' }
  ];
  
  const viewDetails = (row) => {  
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 uppercase">Order Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <p className="uppercase"><span className="font-medium">Order No:</span> {row.orderNo}</p>
            <p className="uppercase"><span className="font-medium">Order Date:</span> {formatDateToDDMMYYYY(row.orderDate)}</p>
            <p className="uppercase"><span className="font-medium uppercase">Order Amount:</span> ₹ {row.orderAmount}</p>
          </div>
        </div>
  
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 uppercase">Salespersons</h3>
          <div className="flex flex-wrap gap-2">
              <span
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold uppercase"
              >
                {row?.salesPersonIds?.salesPersId?.salesPersonName || 'N/A'}
              </span>
          </div>
        </div>
  
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 uppercase">Customers </h3>
          <div className="flex flex-wrap gap-2">
              <span
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold uppercase"
              >
                {row.customerIds.custId?.customerName || 'N/A'}
              </span>
          </div>
        </div>  
      </div>
    );
  };  


  const formatOnEdit = (row)=>{
    const data = {
      ...row, 
      salesPersonIds:{salesPersId:row?.salesPersonIds?.salesPersId?._id}, 
      customerIds:{custId:row?.customerIds?.custId?._id}  
    }
    return data
  }

  return (
    <>
    <Navbar/>
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Order</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setModalOpen(true);
            setSelectedOrder(null);
          }}
        >
          Create
        </button>
      </div>

      <CustomTable
        data={orders} 
        columns={columns}
        handleEdit={handleEdit} 
        handleDelete={handleDelete}
        viewDetails={true}
        modalContent={viewDetails}
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-600" onClick={() => setModalOpen(false)}>
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">{selectedOrder ? 'Edit' : 'Create'} Order</h2>

            <Formik
              initialValues={
                selectedOrder && formatOnEdit(selectedOrder) || { orderNo: '', orderDate: '', orderAmount: '', salesPersonIds: {}, customerIds: {} }
              }
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              <Form className="space-y-4">
                <div>
                  <label className="block">Order No</label>
                  <Field name="orderNo" className="w-full border px-3 py-2 rounded" />
                  <ErrorMessage name="orderNo" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                <label htmlFor="orderDate" className="block mb-1">Order Date</label>
                <Field
                  name="orderDate"
                  type="date"
                  className="w-full border px-3 py-2 rounded"
                />
                <ErrorMessage name="orderDate" component="div" className="text-red-500 text-sm" />
              </div>
                <div>
                  <label className="block">Order Amount</label>
                  <Field name="orderAmount" className="w-full border px-3 py-2 rounded" />
                  <ErrorMessage name="orderAmount" component="div" className="text-red-500 text-sm" />
                </div>
                <Dropdown
                  name="salesPersonIds"
                  label="Sales Person"
                  options={salesPersons}
                  keyId="salesPersId" 
                  keyName="salesPersonName"
                />

                <Dropdown
                  name="customerIds"
                  label="Customer"
                  options={customers}
                  keyId="custId"
                  keyName="customerName"
                />
                <div className="flex justify-end">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    {selectedOrder ? 'Update' : 'Create'}
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Order;
