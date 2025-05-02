// SalesPersonMaster.jsx
import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import Navbar from './Navbar';
import { API_END_POINTS } from '../api';
import CustomTable from '../components/CustomTable';
import Swal from 'sweetalert2';
const token = localStorage.getItem("token")

const SalesPerson = () => {
  const [salesPersons, setSalesPersons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);

  const fetchSalesPersons = async () => {
    const res = await axios.get(API_END_POINTS.salesPerson.getAll,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    setSalesPersons(res?.data || []);
  };

  useEffect(() => {
    fetchSalesPersons();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (selectedSalesPerson) {
        console.log(selectedSalesPerson)
        await axios.put(API_END_POINTS.salesPerson.update, values, {
          params: { id: selectedSalesPerson._id },
          headers: {
            Authorization: `Bearer ${token}`,   
          },
        });
      } else {
        await axios.post(API_END_POINTS.salesPerson.create, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
  
      fetchSalesPersons();
      resetForm();
      setModalOpen(false);
      setSelectedSalesPerson(null);
  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: selectedSalesPerson ? 'Salesperson updated successfully' : 'Salesperson created successfully',
      });
  
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(API_END_POINTS.salesPerson.delete, {
      params:{id},
      headers:{
        Authorization:`Bearer ${token}`} ,
    }); 
    fetchSalesPersons();
  };

  const handleEdit = (salesperson) => {
    setSelectedSalesPerson(salesperson);
    setModalOpen(true);
  };

  const validationSchema = Yup.object({
    salesPersonNo: Yup.string()
      .trim()
      .required('Salesperson No is required')
      .matches(/^[a-zA-Z0-9-]+$/, 'Salesperson No can only contain letters, numbers, and hyphens')
      .min(3, 'Salesperson No must be at least 3 characters')
      .max(20, 'Salesperson No cannot exceed 20 characters'),
    salesPersonName: Yup.string()
      .trim() 
      .required('Name is required')
      .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    city: Yup.string()
      .trim()
      .required('City is required')
      .matches(/^[a-zA-Z\s]+$/, 'City can only contain letters')
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City cannot exceed 50 characters'),
  });

  const columns = [
    { title: 'Salesperson No', key: 'salesPersonNo' },
    { title: 'Name', key: 'salesPersonName' },
    { title: 'City', key: 'city' },
  ];  

  const viewDetails = (row) => {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Salesperson Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <p className="uppercase"><span className="font-medium">Salesperson No:</span> {row.salesPersonNo}</p>
            <p className="uppercase"><span className="font-medium">Salesperson Name:</span> {row.salesPersonName}</p>
            <p className="uppercase"><span className="font-medium">City:</span> {row.city}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 uppercase">Customers ({row.customers.length})</h3>
          <div className="flex flex-wrap gap-2">
            {row.customers.length > 0 ? (
              row.customers.map((item) => (
                <p
                  key={item._id}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold uppercase"
                > 
                  {item.customerName || 'N/A'}<span className='text-black'> ({item.customerNo || 'N/A'})</span>
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

  return (
    <>
    <Navbar/>
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Salesperson</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setModalOpen(true);
            setSelectedSalesPerson(null);
          }}
        >
          Create
        </button>
      </div>

      <CustomTable
        data={salesPersons} 
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
            <h2 className="text-lg font-semibold mb-4">{selectedSalesPerson ? 'Edit' : 'Create'} SalesPerson</h2>

            <Formik
              initialValues={
                selectedSalesPerson || { salesPersonNo: '', salesPersonName: '', city: '' }
              }
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              <Form className="space-y-4">
                <div>
                  <label className="block">Salesperson No</label>
                  <Field name="salesPersonNo" className="w-full border px-3 py-2 rounded" />
                  <ErrorMessage name="salesPersonNo" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block">Name</label>
                  <Field name="salesPersonName" className="w-full border px-3 py-2 rounded" />
                  <ErrorMessage name="salesPersonName " component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block">City</label>
                  <Field name="city" className="w-full border px-3 py-2 rounded" />
                  <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    {selectedSalesPerson ? 'Update' : 'Create'}
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

export default SalesPerson;
