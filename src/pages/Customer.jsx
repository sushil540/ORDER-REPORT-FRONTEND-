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
const token = localStorage.getItem("token")

const Customer = () => {
  const [salesPersons, setSalesPersons] = useState([]);
  const [customer, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
    fetchCustomers();
    fetchSalesPersons();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try{
    const payload = {
        ...values,
        salesPersonIds: values.salesPersonIds.map(id => ({
            ...id
          }))
      };
    if (selectedCustomer) {
      await axios.put(API_END_POINTS.customer.update, payload, {
        params: { id: selectedCustomer._id },
        headers: {
          Authorization: `Bearer ${token}`,         
        },
    });
    } else {
      await axios.post(API_END_POINTS.customer.create, payload,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
    }
    fetchCustomers();
    resetForm();
    setModalOpen(false);
    setSelectedCustomer(null);

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: selectedCustomer ? 'Customer updated successfully' : 'Customer created successfully',
    });
  }catch(error){
    console.log(error)
    Swal.fire({ 
      icon: 'error',
      title: 'Error',
      text: error?.response?.data?.message || 'Something went wrong. Please try again.',
    });
  }
  };

  const handleDelete = async (id) => {
    await axios.delete(API_END_POINTS.customer.delete, {
        params:{id},
        headers:{
            Authorization:`Bearer ${token}`
        }});
    fetchCustomers();
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const validationSchema = Yup.object({
    customerNo: Yup.string()
      .trim()
      .required('Customer No is required')
      .matches(/^[a-zA-Z0-9-]+$/, 'Customer No can only contain letters, numbers, and hyphens')
      .min(3, 'Customer No must be at least 3 characters')
      .max(20, 'Customer No cannot exceed 20 characters'),
    customerName: Yup.string()
      .trim() 
      .required('Customer Name is required')
      .matches(/^[a-zA-Z\s]+$/, 'Customer Name can only contain letters')
      .min(2, 'Customer Name must be at least 2 characters')
      .max(50, 'Customer Name cannot exceed 50 characters'),
    city: Yup.string()
      .trim()   
      .required('City is required')
      .matches(/^[a-zA-Z\s]+$/, 'City can only contain letters')
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City cannot exceed 50 characters'),
    salesPersonIds: Yup.array()
      .of(
        Yup.object().shape({
          salesPersId: Yup.string()
            .required('SalesPerson is required')
        })
      )
      .min(1, 'At least one SalesPerson is required')
      .test('unique-salesPersId', 'Duplicate SalesPerson selected', function (value) {
        console.log({value})
        if (!value) return true;

        const ids = value.map(v => {
          if (typeof v.salesPersId === 'object' && v.salesPersId !== null && v.salesPersId._id) {
            return v.salesPersId._id;
          }
          return v.salesPersId;
        });
  
        return ids.length === new Set(ids).size;
      })  
  });

  const columns = [
    { title: 'Customer No', key: 'customerNo' },
    { title: 'Customer Name', key: 'customerName' },
    { title: 'City', key: 'city' },
    { title: 'Salespersons', key : 'salesPersonIds' }
  ];

  const viewDetails = (row) => {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 uppercase">Customer Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <p className="uppercase"><span className="font-medium">Customer No:</span> {row.customerNo}</p>
            <p className="uppercase"><span className="font-medium">Customer Name:</span> {row.customerName}</p>
            <p className="uppercase"><span className="font-medium">City:</span> {row.city}</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 uppercase">Salespersons ({row.salesPersonIds.length})</h3>
          <div className="flex flex-wrap gap-2">
            {row.salesPersonIds.length > 0 ? (
              row.salesPersonIds.map((item, index) => (
                <span
                  key={item._id}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold uppercase"
                >
                  {item.salesPersId?.salesPersonName || 'N/A'}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No sales persons</span>
            )}
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">ORDERS ({row.orders.length})</h3>
        <div className="flex flex-wrap gap-2">
          {row.orders.length > 0 ? (
            row.orders.map((item) => (
              <p
                key={item._id}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold uppercase"
              >
                {item.orderNo || 'N/A'}<span className='text-black'> ({(formatDateToDDMMYYYY(item.orderDate)) || 'N/A'})</span>
              </p>
            ))
          ) : (
            <span className="text-sm text-gray-500">No Customers</span>
          )}
        </div>
      </div>
      </div>
    );
  };  

  const formatOnEdit = (row)=>{
    const data = {...row, salesPersonIds:row.salesPersonIds.map((ele)=>({salesPersId:ele.salesPersId._id})) }
    console.log(data)
    return data
  }

  return (
    <>
    <Navbar/>
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Customer</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setModalOpen(true);
            setSelectedCustomer(null);
          }}
        >
          Create
        </button>
      </div>

      <CustomTable
        data={customer} 
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
            <h2 className="text-lg font-semibold mb-4">{selectedCustomer ? 'Edit' : 'Create'} Customer</h2>

            <Formik
                initialValues={
                selectedCustomer && formatOnEdit(selectedCustomer) || { customerNo: '', customerName: '', city: '', salesPersonIds: [] }
              } 
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              <Form className="space-y-4">
                <div>
                  <label className="block">Customer No</label>
                  <Field name="customerNo" className="w-full border px-3 py-2 rounded" />
                  <ErrorMessage name="customerNo" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block">Name</label>
                  <Field name="customerName" className="w-full border px-3 py-2 rounded" />
                  <ErrorMessage name="customerName" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block">City</label>
                  <Field name="city" className="w-full border px-3 py-2 rounded" />
                  <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                </div>
                <MultiSelectField
                    name="salesPersonIds"
                    label="Sales Persons"
                    options={salesPersons}
                    keyId="salesPersId"
                    keyName="salesPersonName"
                />
                <div className="flex justify-end">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    {selectedCustomer ? 'Update' : 'Create'}
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

export default Customer;
