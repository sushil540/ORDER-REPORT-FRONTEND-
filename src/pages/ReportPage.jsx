import { useState } from "react";
import { Formik, Form, Field } from "formik";
import axios from "../config/axios";
import * as Yup from "yup";
import MultiSelectField from "../components/MultiSelectField";
import { API_END_POINTS } from "../api";
import Swal from "sweetalert2";
import Navbar from "./Navbar";
const token = localStorage.getItem('token');

export default function ReportPage() {
  const [reportData, setReportData] = useState("");
  const [res, setRes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("pdf");

  const allFields = [
    { _id: "1", orderId: "orderNo", orderField: "Order Number" },
    { _id: "2", orderId: "orderDate", orderField: "Order Date" },
    { _id: "3", orderId: "orderAmount", orderField: "Order Amount" },
    { _id: "4", orderId: "customerIds", orderField: "Customer Name" },
    { _id: "5", orderId: "salesPersonIds", orderField: "Salesperson Name" },
  ];

  const initialValues = {
    fromDate: "",
    toDate: "",
    fields: [],
    reportType: "",
    granularity: "month",
    salesperson: "",
    customer: "",
    city: "",
  };

const validationSchema = Yup.object({
    fromDate: Yup.string(),
    // .required("From date is required"),
    toDate: Yup.string(),
    // .required("To date is required"),
    fields: Yup.array()
    .of(
      Yup.object().shape({  
        orderId: Yup.string()
          .required('Field is required')
      })
    )
    // .min(1, 'Select at least one field')
    .test('unique-orderId', 'Duplicate field selected', function (value) {
      const ids = value?.map(v => v.orderId);
      return ids.length === new Set(ids).size;
    }),
    reportType: Yup.string(),
    // .required("Required"), 
    granularity: Yup.string()
    // .required("Required")
  });

  const generateBlobData = (response)=>{
      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      setReportData(blobUrl);
  }
  
  const handleGenerateReport = async (values) => {
    try { 
      const selectedIds = values.fields.map(f => f.orderId);
      const matchedFields = allFields.filter(field => selectedIds.includes(field._id));
  
      const response = await axios.post(
        API_END_POINTS.report.create,
        {
          fromDate: values.fromDate,
          toDate: values.toDate,
          fields: matchedFields,
          reportType:values.reportType,
          timeGranularity: values.granularity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
  
      setRes(response);
      generateBlobData(response);
      setIsModalOpen(true);
  
      Swal.fire({
        icon: 'success',
        title: 'Report Generated',
        text: 'The PDF report has been successfully generated!',
        timer: 2000,
        showConfirmButton: false
      });
  
    } catch (err) {
      console.error("Error generating report:", err);
  
      Swal.fire({
        icon: 'error',
        title: 'Failed to Generate',
        text: 'There was an error generating the report. Please try again.',
      });
    }
  };

  const handleDownload = () => {
    // Optional download logic
    const contentDisposition = res.headers["content-disposition"];
    const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
    const filename = filenameMatch ? filenameMatch[1] : `report-${Date.now()}.pdf`;

    const downloadLink = document.createElement("a");
    downloadLink.href = reportData;
    downloadLink.download = filename;
    downloadLink.click();
  };

  return (
    <>
      <Navbar/>
    <div className="p-6 my-3 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Order Report</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleGenerateReport}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <label htmlFor="fromDate">From Date</label>
                <Field
                  name="fromDate"
                  type="date"
                  className="border px-2 py-1 rounded"
                />
                {touched.fromDate && errors.fromDate && (
                  <div className="text-red-500 text-sm">{errors.fromDate}</div>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="toDate">To Date</label>
                <Field
                  name="toDate"
                  type="date"
                  className="border px-2 py-1 rounded"
                />
                {touched.toDate && errors.toDate && (
                  <div className="text-red-500 text-sm">{errors.toDate}</div>
                )}
              </div>
              <div className="min-w-80">
                <MultiSelectField
                  name="fields"
                  label="Order Fields"  
                  options={allFields} 
                  keyId="orderId"
                  keyName="orderField"
                />  
                </div>
            </div>
            <div>
            <label>Report Type:</label>
            <Field
              as="select"
              name="reportType"
              className="w-full p-2 border"
            >
              <option value="">Select...</option>
                  <option value="sales_by_salesperson">Salesperson Contribution</option>
                  <option value="sales_summary">Sales Summary</option>
                  <option value="top_customers">Top Customers</option>
                  <option value="orders_summary">Orders Summary</option>
            </Field>
            {touched.reportType && errors.reportType && (
              <div className="text-red-600 text-sm">{errors.reportType}</div>
            )}
          </div>  
        <div>
          <label>Time Granularity:</label>
          <Field
            as="select"
            name="granularity"
            className="w-full p-2 border"
          >
          <option value="">Select...</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </Field>
        </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Generate Report
            </button>
          </Form>
        )}
      </Formik>

      {reportData.length > 0 && (
        <>
          <div className="flex justify-between items-center mt-6">
            <h3 className="text-xl font-semibold">Report</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Preview PDF
            </button>
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
          </div>
        </>
      )}
    {/* Custom Modal */}
      {isModalOpen && reportData && ( 
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
          <h3 className="text-xl font-semibold mb-4">PDF Preview</h3>
          <div className="w-full h-[70vh] border rounded overflow-hidden">
            <iframe
              src={reportData}
              className="w-full h-full"
              title="PDF Report"
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
    </> 
  );
} 

