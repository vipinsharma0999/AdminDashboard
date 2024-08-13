"use client";

import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { NotificationManager } from "react-notifications";
import Loader from "@/components/common/Loader";

const FormLayoutClient = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    firstName?: string;
    phoneNumber?: string;
  }>({});
  const [loading, setLoading] = useState(true);

  // Simulate loading state on page load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Adjust the delay as needed
    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, []);

  // Validate phone number function
  const validatePhoneNumber = (number: string) => {
    const pattern = /^\d{10}$/;
    return pattern.test(number);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { firstName?: string; phoneNumber?: string } = {};

    if (!firstName) newErrors.firstName = "First name required";

    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulate form submission with a timeout
    setTimeout(() => {
      setLoading(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setMessage("");
      NotificationManager.success("Form submitted successfully!");
      console.log("Form submitted successfully");
    }, 2000); // 2 seconds loader
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");
    setPhoneNumber(numericValue);

    if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: undefined });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="FootFall" />
      {loading ? (
        <Loader />
      ) : (
        <div className="grid">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Contact Form
                </h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2 xl:pr-2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        First name <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (errors.firstName)
                            setErrors({ ...errors, firstName: undefined });
                        }}
                        className={`w-full rounded border-[1.5px] ${
                          errors.firstName ? "border-red" : "border-stroke"
                        } bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                      />
                      {errors.firstName && (
                        <p className="text-red">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="w-full xl:w-1/2 xl:pl-2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Last name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2 xl:pr-2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    <div className="w-full xl:w-1/2 xl:pl-2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Phone Number <span className="text-meta-1">*</span>
                      </label>
                      <input
                        id="phoneNumber"
                        type="text"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        onBlur={() => {
                          if (!validatePhoneNumber(phoneNumber)) {
                            setErrors({
                              ...errors,
                              phoneNumber:
                                "Please enter a valid 10-digit phone number",
                            });
                          }
                        }}
                        className={`w-full rounded border-[1.5px] ${
                          errors.phoneNumber ? "border-red" : "border-stroke"
                        } bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                        inputMode="numeric"
                      />
                      {errors.phoneNumber && (
                        <p className="text-red">{errors.phoneNumber}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Address
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Type your address"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="relative flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    {loading ? (
                      <div className="relative flex items-center">
                        <div className="loader"></div>
                        <span className="ml-2">Sending...</span>
                      </div>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3; /* Light grey */
          border-top: 4px solid #3498db; /* Blue */
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .relative {
          position: relative;
        }
      `}</style>
    </DefaultLayout>
  );
};

export default FormLayoutClient;
