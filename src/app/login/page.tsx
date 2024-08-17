"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Define the validation schema using Yup
const validationSchema = Yup.object({
  contact: Yup.string().required("Phone Number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Remove any existing token from localStorage
  localStorage.removeItem("token");

  // Handle form submission
  const handleSubmit = async (values: { contact: string; password: string }) => {
    try {
      const response = await fetch("http://localhost:3500/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful! Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("Username or password is incorrect");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md border-stroke dark:border-strokedark max-sm:p-5 xl:w-1/2">
        <div className="xl:p-20.5 border-gray-300 dark:bg-gray-800 w-full rounded-lg border-2 bg-white p-10 shadow-lg sm:p-15.5">
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Login to ISKCON Jaipur
          </h2>

          <Formik
            initialValues={{ contact: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Field
                      type="text"
                      name="contact"
                      placeholder="Enter your contact"
                      className={`w-full rounded-lg border ${
                        errors.contact && touched.contact
                          ? "border-red"
                          : "border-stroke"
                      } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    />
                    <ErrorMessage
                      name="contact"
                      component="div"
                      className="text-sm text-red"
                    />
                    <span className="absolute right-4 top-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#b1b9c5"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-phone"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.08 4.18 2 2 0 0 1 5 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .56 2.57 2 2 0 0 1-.45 2l-1.27 1.27a16 16 0 0 0 6.58 6.58l1.27-1.27a2 2 0 0 1 2-.45 12.05 12.05 0 0 0 2.57.56A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      className={`w-full rounded-lg border ${
                        errors.password && touched.password
                          ? "border-red"
                          : "border-stroke"
                      } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red"
                    />
                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Login"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {/* React Toastify Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Login;

