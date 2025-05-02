import React, { useState } from 'react';
import { Field, ErrorMessage } from 'formik';

const   MultiSelectField = ({ name, label, options, keyId, keyName }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 relative">
      {label && <label className="block mb-1">{label}</label>}

      <Field name={name}>
        {({ field, form }) => {
          const selectedIds = field.value.map(v => v[keyId]);
          const selectedOptions = options.filter(opt => selectedIds.includes(opt._id));
          const unselectedOptions = options.filter(opt => !selectedIds.includes(opt._id));

          const handleSelect = (id) => {
            const updated = [...field.value, { [keyId]: id }];
            form.setFieldValue(name, updated);
          };

          const handleRemove = (id) => {
            const updated = field.value.filter(item => item[keyId] !== id);
            form.setFieldValue(name, updated);
          };

          return (
            <>
              <div
                className="border rounded px-3 py-5 w-full cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="flex flex-wrap gap-2">
                  {selectedOptions.map(opt => (
                    <div
                      key={opt._id}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
                    >
                      {opt[keyName]}
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(opt._id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {isOpen && (
                <div className="absolute z-10 mt-1 bg-white border rounded w-full max-h-40 overflow-y-auto shadow">
                  {unselectedOptions.length > 0 ? (
                    unselectedOptions.map(opt => (
                      <div
                        key={opt?._id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelect(opt._id)}
                      >
                        {opt[keyName]}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">No options left</div>
                  )}
                </div>
              )}
            </>
          );
        }}
      </Field>
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
  );  
};

export default MultiSelectField;

