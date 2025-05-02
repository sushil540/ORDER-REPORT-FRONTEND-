import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import Navbar from './Navbar';
import { API_END_POINTS } from '../api';
import DashboardCard from '../components/DashboardCard';
const token = localStorage.getItem("token")

const Dashboard = () => {
  const [dashboardRes, setDashboardRes] = useState([])
  const fetchDashboard = async()=>{
    try{
      const response = await axios.get(API_END_POINTS.auth.dashboard, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDashboardRes(response.data)
    }catch(error){
      console.error('Error fetching dashboard data:', error);
    }
  }

  useEffect(()=>{
    fetchDashboard()
  },[])

 return (
    <>  
  <Navbar />  
    {/* Welcome Note */}
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome back!
      </h1>
    </div>
  <div className=" p-6 min-h-full bg-gray-50">
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-5xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total" 
          value={dashboardRes.salesPersons} 
          max={500}
          label="Sales Persons" 
          color="text-green-600" 
        />
      <DashboardCard
        title="Total"
        value={dashboardRes.customers} 
        max={500}
        label="Customers"
        color="text-green-600" 
      />
      <DashboardCard
        title="Total"
        value={dashboardRes.orders}
        max={500}
        label="Orders"
        color="text-purple-600"
      />
    </div>
  </div>
  </>
 )
};

export default Dashboard;
