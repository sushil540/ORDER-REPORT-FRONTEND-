const Modal = ({ onClose, children, title }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              ✕
            </button>
          </div>    
          <div>{children}</div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  