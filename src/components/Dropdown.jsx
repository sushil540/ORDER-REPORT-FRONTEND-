import React, { useState } from 'react';
import { Field, ErrorMessage } from 'formik';

const Dropdown = ({ name, label, options, keyId, keyName }) => {
  const [isOpen, setIsOpen] = useState(false);


  console.log({ name, label, options, keyId, keyName })
  return (
    <div className="mb-4 relative">
      {label && <label className="block mb-1">{label}</label>}

      <Field name={name}>
        {({ field, form }) => {
          const selectedId = field.value?.[keyId];
          const selectedOption = options.find(opt => opt._id === selectedId);

          const handleSelect = (id) => {
            form.setFieldValue(name, { [keyId]: id });
            setIsOpen(false);
          };

          const handleClear = () => {
            form.setFieldValue(name, {});
          };

          return (
            <>
              <div
                className="border rounded px-3 py-2 w-full cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="flex justify-between items-center">
                  <span>{selectedOption ? selectedOption[keyName] : "Select an option"}</span>
                  {selectedOption && (
                    <button
                      type="button"
                      className="text-red-500 ml-2 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClear();
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="absolute z-10 mt-1 bg-white border rounded w-full max-h-40 overflow-y-auto shadow">
                  {options.map(opt => (
                    <div
                      key={opt._id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelect(opt._id)}
                    >
                      {opt[keyName]}
                    </div>
                  ))}
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

export default Dropdown;
