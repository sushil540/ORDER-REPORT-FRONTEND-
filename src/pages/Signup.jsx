// import { useNavigate } from "react-router-dom";
// import axios from "../config/axios";
// import { API_END_POINTS } from "../api";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import Swal from "sweetalert2";

// export default function Signup() {
//   const navigate = useNavigate();

//   const validationSchema = Yup.object().shape({
//     email: Yup.string()
//       .email("Invalid email")
//       .required("Email is required"),
//     password: Yup.string()
//       .required("Password is required")
//       .test("is-strong", "Password must be strong", value =>
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/.test(value)
//       )
//       .min(8, "Password must be at least 8 characters"),
//   });

//   const initialValues = {
//     email: "",
//     password: "",
//   };

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       await axios.post(API_END_POINTS.auth.signup, values);
//       Swal.fire("Success", "Registered successfully!", "success");
//       resetForm();
//       navigate("/login");
//     } catch (err) {
//       const errorMsg = err?.response?.data?.message || "Signup failed";
//       Swal.fire("Error", errorMsg, "error");
//     } finally {
//       setSubmitting(false); 
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 px-4">
//   <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
//     <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Your Account</h2>

//     <Formik   
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={handleSubmit}
//       validateOnBlur
//       validateOnChange
//       validateOnMount
//     >
//       {({ isSubmitting }) => (
//         <Form className="space-y-5">
//           {/* Email Field */}
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <Field
//               name="email"
//               type="email"
//               placeholder="you@example.com"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//             />
//             <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
//           </div>

//           {/* Password Field */}
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <Field
//               name="password"
//               type="password"
//               placeholder="••••••••"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//             />
//             <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 rounded-lg shadow-sm disabled:opacity-50"
//           >
//             {isSubmitting ? "Signing up..." : "Sign Up"}
//           </button>
//         </Form>
//       )}
//     </Formik>

//     <p className="mt-5 text-sm text-center text-gray-600">
//       Already have an account?{" "}
//       <span
//         className="text-blue-600 font-medium hover:underline cursor-pointer"
//         onClick={() => navigate("/login")}
//       >
//         Login
//       </span>
//     </p>
//   </div>
//   </div>
//   );
// } 

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../config/axios";
import { API_END_POINTS } from "../api";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

export default function Signup() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(API_END_POINTS.auth.signup, data);
      Swal.fire("Success", "Registered successfully!", "success");
      navigate("/login");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Signup failed";
      Swal.fire("Error", errorMsg, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Your Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 rounded-lg shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 font-medium hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
