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
  const [contact, setcontact] = useState("");
  const [panCard, setPanCard] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [availableSlots, setAvailableSlots] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setaddress] = useState("");
  const [purposes, setPurposes] = useState<any[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    firstName?: string;
    contact?: string;
    bookingDate?: string;
    purpose?: string;
    availableSlots?: string;
    amount?: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const todayDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  const [purposeId, setPurposeId] = useState<string>(""); // For purpose_id

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch purposes for dropdown
    fetch("http://localhost:3000/donationpurpose", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const purposeList = data.map((item: { purpose_id: string, purpose_name: string }) => ({
          id: item.purpose_id,
          name: item.purpose_name
        }));
        setPurposes(purposeList);
      })
      .catch((error) => {
        NotificationManager.error("Error fetching purposes. Please try again.");
        console.error("Error fetching purposes:", error);
      });

    // Fetch available slots for dropdown (assuming a similar API endpoint)
    fetch("/api/slots")
      .then((response) => response.json())
      .then((data) => {
        setSlots(data);
      })
      .catch((error) => console.error("Error fetching slots:", error));
  }, []);

  const validatecontact = (number: string) => {
    const pattern = /^\d{10}$/;
    return pattern.test(number);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: {
      firstName?: string;
      contact?: string;
      bookingDate?: string;
      purpose?: string;
      availableSlots?: string;
      amount?: string;
    } = {};

    if (!firstName) newErrors.firstName = "First name required";
    if (!contact || !validatecontact(contact)) {
      newErrors.contact = "Please enter a valid 10-digit phone number";
    }
    if (!bookingDate) newErrors.bookingDate = "Booking date required";
    if (new Date(bookingDate) < new Date(todayDate)) {
      newErrors.bookingDate = "Booking date cannot be in the past";
    }
    if (!purposeId) newErrors.purpose = "Purpose required";
    // if (!availableSlots) newErrors.availableSlots = "Slot selection required";
    if (!amount) newErrors.amount = "Amount required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Prepare form data
    const formData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      contact: contact,
      address: address,
      pan_card: panCard,
      role_id: 2,
      transaction_id: '',
      amount: amount,
      purpose_id: purposeId,
      referral_id: localStorage.getItem("user"),
      slot_id: 1,
      // slot_id: availableSlots,
    };

    // Submit form data
    fetch("http://localhost:3000/users/footfall", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (response.status === 201) {
          // Handle the response from the API
          NotificationManager.success("Booking successful!", "Success", 3000);
          setLoading(false);
          // Clear form fields if needed
          setFirstName("");
          setLastName("");
          setEmail("");
          setcontact("");
          setPanCard("");
          setBookingDate("");
          setPurpose("");
          setAvailableSlots("");
          setAmount("");
          setaddress("");
        } else {
          throw new Error(`Unexpected status code: ${response.status}`); // Throw an error for other status codes
        }
      })
      .catch(error => {
        setLoading(false);
        NotificationManager.error("Form submission failed. Please try again.");
        console.error("Error submitting form:", error);
      });
  };

  const handlecontactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");
    setcontact(numericValue);

    if (errors.contact) setErrors({ ...errors, contact: undefined });
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
                  Footfall Form
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
                        className={`w-full rounded border-[1.5px] ${errors.firstName ? "border-red" : "border-stroke"
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
                        id="contact"
                        type="text"
                        placeholder="Enter your phone number"
                        value={contact}
                        onChange={handlecontactChange}
                        onBlur={() => {
                          if (!validatecontact(contact)) {
                            setErrors({
                              ...errors,
                              contact:
                                "Please enter a valid 10-digit phone number",
                            });
                          }
                        }}
                        className={`w-full rounded border-[1.5px] ${errors.contact ? "border-red" : "border-stroke"
                          } bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                        inputMode="numeric"
                      />
                      {errors.contact && (
                        <p className="text-red">{errors.contact}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2 xl:pr-2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        PAN Card
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your PAN card number"
                        value={panCard}
                        onChange={(e) => setPanCard(e.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    <div className="w-full xl:w-1/2 xl:pl-2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Booking Date <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => {
                          setBookingDate(e.target.value);
                          if (errors.bookingDate)
                            setErrors({ ...errors, bookingDate: undefined });
                        }}
                        className={`w-full rounded border-[1.5px] ${errors.bookingDate ? "border-red" : "border-stroke"
                          } bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                      />
                      {errors.bookingDate && (
                        <p className="text-red">{errors.bookingDate}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2 xl:pr-2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Purpose <span className="text-meta-1">*</span>
                      </label>
                      <select
                        value={purposeId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          setPurposeId(selectedId);
                          if (errors.purpose)
                            setErrors({ ...errors, purpose: undefined });
                        }}
                        className={`w-full rounded border-[1.5px] ${errors.purpose ? "border-red" : "border-stroke"
                          } bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                      >
                        <option value="">Select a purpose</option>
                        {purposes.map(purpose => (
                          <option key={purpose.id} value={purpose.id}>
                            {purpose.name}
                          </option>
                        ))}
                      </select>
                      {errors.purpose && (
                        <p className="text-red">{errors.purpose}</p>
                      )}
                    </div>
                    <div className="w-full xl:w-1/2 xl:pl-2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Available Slots <span className="text-meta-1">*</span>
                      </label>
                      <select
                        value={availableSlots}
                        onChange={(e) => {
                          setAvailableSlots(e.target.value);
                          if (errors.availableSlots)
                            setErrors({ ...errors, availableSlots: undefined });
                        }}
                        className={`w-full rounded border-[1.5px] ${errors.availableSlots ? "border-red" : "border-stroke"
                          } bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                      >
                        <option value="">Select slot</option>
                        {slots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      {errors.availableSlots && (
                        <p className="text-red">{errors.availableSlots}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Amount <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter the amount"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (errors.amount)
                          setErrors({ ...errors, amount: undefined });
                      }}
                      className={`w-full rounded border-[1.5px] ${errors.amount ? "border-red" : "border-stroke"
                        } bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    />
                    {errors.amount && (
                      <p className="text-red">{errors.amount}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Address
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Enter your address"
                      value={address}
                      onChange={(e) => setaddress(e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded bg-primary p-3 font-medium text-gray"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default FormLayoutClient;
