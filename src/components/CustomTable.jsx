import { useState } from "react";
import Swal from "sweetalert2";
import { Eye, Edit, Trash2 } from "lucide-react";
import formatDateToDDMMYYYY from "./helpers/dateFormat";

export default function CustomTable({
  data,
  columns,
  handleEdit,
  handleDelete,
  viewDetails,
  modalContent,
}) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
        Swal.fire("Deleted!", "The record has been deleted.", "success");
      }
    });
  };

  const RowDetails = ({ value, columnKey }) => {
    if (!value || typeof value !== "object") return null;
    if (columnKey === "salesPersonIds") {
      return (
        <div className="flex flex-wrap gap-1">
          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs uppercase truncate">
            {value?.salesPersId?.salesPersonName || "N/A"}
          </span>
        </div>
      );
    }

    if (columnKey === "customerIds") {
      return (
        <div className="flex flex-wrap gap-1">
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs uppercase truncate">
            {value?.custId?.customerName || "N/A"}
          </span>
        </div>
      );
    }

    return <span>{JSON.stringify(value)}</span>; 
  };

  return (
    <>
      <table className="min-w-full bg-white border border-gray-300 shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Sl No</th>
            {columns.map((col, index) => (
              <th key={index} className="border p-2">
                {col.title}
              </th>
            ))}
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 2}
                className="text-center p-4 text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            paginatedData.map((row, index) => (
              <tr key={row._id || index} className="text-center">
                <td className="border p-2 truncate">{(currentPage - 1) * rowsPerPage + index + 1}</td>

                {columns.map((col) => {
                  const cellValue = row[col.key];

                  if (typeof cellValue === "object" && cellValue !== null) {
                    return (
                      <td key={col.key} className="border p-2">
                        <RowDetails value={cellValue} columnKey={col.key} />
                      </td>
                    );
                  }

                  const displayValue =
                    col.key === "orderDate"
                      ? formatDateToDDMMYYYY(cellValue)
                      : cellValue?.toString().toUpperCase();

                  return (
                    <td key={col.key} className="border p-2 truncate">
                      {displayValue || "N/A"}
                    </td>
                  );
                })}

                <td className="border p-3 flex justify-center items-center gap-4">
                  {viewDetails && (
                    <button
                      className="text-green-600"
                      onClick={() => setSelectedRow(row)}
                    >
                      <Eye size={18} />
                    </button>
                  )}
                  {handleEdit && (
                    <button
                      className="text-blue-600"
                      onClick={() => handleEdit(row)}
                    >
                      <Edit size={18} />
                    </button>
                  )}
                  {handleDelete && (
                    <button
                      className="text-red-600"
                      onClick={() => confirmDelete(row._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selectedRow && modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            {modalContent(selectedRow)}
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => setSelectedRow(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
