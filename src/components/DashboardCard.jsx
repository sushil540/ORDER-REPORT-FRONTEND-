// import React from 'react';

// const DashboardCard = ({
//   title = "Total",
//   value,
//   label,
//   color = "text-blue-600",
//   max = 100,
// }) => {
//   const percentage = Math.min((value / max) * 100, 100); // ensure it doesn't exceed 100%
//   const radius = 50;
//   const stroke = 8;
//   const normalizedRadius = radius - stroke * 0.5;
//   const circumference = normalizedRadius * 2 * Math.PI;
//   const strokeDashoffset = circumference - (percentage / 100) * circumference;

//   return (
//     <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition text-center">
//       <div className="text-gray-600 text-xl font-semibold mb-4">{title}</div>
      
//       <div className="relative w-28 h-28 mx-auto mb-4">
//         <svg height={radius * 2} width={radius * 2}>
//           <circle
//             stroke="#e5e7eb"
//             fill="transparent"
//             strokeWidth={stroke}
//             r={normalizedRadius}
//             cx={radius}
//             cy={radius}
//           />
//           <circle
//             stroke="currentColor"
//             className={color}
//             fill="transparent"
//             strokeWidth={stroke}
//             strokeDasharray={circumference}
//             strokeDashoffset={strokeDashoffset}
//             strokeLinecap="round"
//             r={normalizedRadius}
//             cx={radius}
//             cy={radius}
//             transform={`rotate(-90 ${radius} ${radius})`}
//           />
//         </svg>
//         <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
//           {value}
//         </div>
//       </div>

//       <div className="text-gray-600 font-medium uppercase text-center">{label}</div>
//     </div>
//   );
// };

// export default DashboardCard;

import React from 'react';

const DashboardCard = ({
  title = "Total",
  value,
  label,
  color = "text-blue-600",
  max = 100,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition text-center">
      <div className="text-gray-600 text-xl font-semibold mb-4">{title}</div>

      <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center">
        <svg className="absolute" height={radius * 2} width={radius * 2}>
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="currentColor"
            className={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        </svg>
        <div className="text-xl font-bold text-gray-800 z-10">{value}</div>
      </div>

      <div className="text-gray-600 font-medium uppercase text-center">{label}</div>
    </div>
  );
};

export default DashboardCard;
