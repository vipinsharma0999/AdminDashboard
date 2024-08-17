"use client";
import React from "react";
import { useEffect, useState } from "react";
import CardDataStats from "../../components/CardDataStats";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/common/Loader";
import { NotificationManager } from "react-notifications";
import { notifyManager } from "@tanstack/react-query";

const dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Initialize dates for the current month
  useEffect(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  const fetchData = async () => {
    if (new Date(endDate) < new Date(startDate)) {
      NotificationManager.warning("End Date cannot be before Start Date.", "Warning", 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/report?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setData(result[0]);
      setReferrals(result[1]);
    } catch (error) {
      setError('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  if (loading) {
    return (
      <DefaultLayout>
        <Loader /> {/* Loader component here */}
      </DefaultLayout>
    );
  }

  return (
    <>
      <DefaultLayout>
        <div className="relative z-20 bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center flex-1">
              <label htmlFor="start-date" className="text-sm font-medium text-gray-700 w-24">Start Date:</label>
              <input
                type="date"
                id="start-date"
                name="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white py-2 pl-4 pr-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center flex-1">
              <label htmlFor="end-date" className="text-sm font-medium text-gray-700 w-24">End Date:</label>
              <input
                type="date"
                id="end-date"
                name="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white py-2 pl-4 pr-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-6">
          <CardDataStats title="Total Pooja" total={data[0]['Number of Bookings']} rate="">
            <svg
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6421 3.10899 20.454C3 20.2401 3 19.96 3 19.4V12.8896C3 12.7892 3 12.739 3.00954 12.6909C3.018 12.6482 3.03201 12.6068 3.0512 12.5677C3.07284 12.5236 3.10329 12.4838 3.16419 12.404L4.36419 10.8326C4.58035 10.5495 4.68843 10.408 4.82038 10.3572C4.93599 10.3127 5.06401 10.3127 5.17962 10.3572C5.31157 10.408 5.41965 10.5495 5.63581 10.8326L6.83581 12.404C6.89671 12.4838 6.92716 12.5236 6.9488 12.5677C6.96799 12.6068 6.982 12.6482 6.99046 12.6909C7 12.739 7 12.7892 7 12.8896M7 21H17M7 21V8.50833C7 8.25789 7 8.13267 7.02886 8.01516C7.05444 7.91099 7.09662 7.81162 7.15378 7.72085C7.21825 7.61845 7.30831 7.53146 7.48845 7.35748L10.8884 4.07358C11.2788 3.69654 11.474 3.50801 11.6976 3.43708C11.8944 3.37465 12.1056 3.37465 12.3024 3.43708C12.526 3.50801 12.7212 3.69654 13.1116 4.07358L16.5116 7.35748C16.6917 7.53146 16.7818 7.61845 16.8462 7.72085C16.9034 7.81162 16.9456 7.91099 16.9711 8.01516C17 8.13267 17 8.25789 17 8.50833V21M17 21H19.4C19.9601 21 20.2401 21 20.454 20.891C20.6422 20.7951 20.7951 20.6421 20.891 20.454C21 20.2401 21 19.96 21 19.4V12.8896C21 12.7892 21 12.739 20.9905 12.6909C20.982 12.6482 20.968 12.6068 20.9488 12.5677C20.9272 12.5236 20.8967 12.4838 20.8358 12.404L19.6358 10.8326C19.4197 10.5495 19.3116 10.408 19.1796 10.3572C19.064 10.3127 18.936 10.3127 18.8204 10.3572C18.6884 10.408 18.5803 10.5495 18.3642 10.8326L17.1642 12.404C17.1033 12.4838 17.0728 12.5236 17.0512 12.5677C17.032 12.6068 17.018 12.6482 17.0095 12.6909C17 12.739 17 12.7892 17 12.8896M14 21V17C14 15.8954 13.1046 15 12 15C10.8954 15 10 15.8954 10 17V21H14Z"
                stroke="#3c50e0"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </CardDataStats>
          <CardDataStats title="Total Special Pooja" total={data[0]['Number of Bookings']} rate="">
            <svg
              width="25px"
              height="25px"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
            >
              <path
                fill="#50A5E6"
                d="M30 22c-3 0-6.688 7.094-7 10c-.421 3.915 2 4 2 4h11V26s-3.438-4-6-4z"
              ></path>
              <ellipse
                transform="rotate(-60 27.574 28.49)"
                fill="#1C6399"
                cx="27.574"
                cy="28.489"
                rx="5.848"
                ry="1.638"
              ></ellipse>
              <path
                fill="#EEC2AD"
                d="M20.086 0c1.181 0 2.138.957 2.138 2.138c0 .789.668 10.824.668 10.824L17.948 18V2.138C17.948.957 18.905 0 20.086 0z"
              ></path>
              <path
                fill="#F7DECE"
                d="M18.875 4.323c0-1.099.852-1.989 1.903-1.989c1.051 0 1.903.891 1.903 1.989c0 0 .535 5.942 1.192 9.37c.878 1.866 1.369 4.682 1.261 6.248c.054.398 5.625 5.006 5.625 5.006c-.281 1.813-2.259 6.155-4.759 8.159l-3.521-2.924c-2.885-.404-4.458-3.331-4.458-4.264c0-2.984.854-21.595.854-21.595z"
              ></path>
              <path
                fill="#50A5E6"
                d="M6 22c3 0 6.688 7.094 7 10c.421 3.915-2 4-2 4H0V26s3.438-4 6-4z"
              ></path>
              <ellipse
                transform="rotate(-30 8.424 28.489)"
                fill="#1C6399"
                cx="8.426"
                cy="28.489"
                rx="1.638"
                ry="5.848"
              ></ellipse>
              <path
                fill="#EEC2AD"
                d="M16.061.011a2.115 2.115 0 0 0-2.333 2.103c0 .78-.184 10.319-.184 10.319L17.895 18l.062-15.765c0-1.106-.795-2.114-1.896-2.224z"
              ></path>
              <path
                fill="#F7DECE"
                d="M17.125 4.323c0-1.099-.852-1.989-1.903-1.989c-1.051 0-1.903.891-1.903 1.989c0 0-.535 5.942-1.192 9.37c-.878 1.866-1.369 4.682-1.261 6.248c-.054.398-5.625 5.006-5.625 5.006C5.522 26.76 7.5 31.102 10 33.106l3.521-2.924c2.885-.404 4.458-3.331 4.458-4.264c0-2.984-.854-21.595-.854-21.595z"
              ></path>
              <path
                fill="#EEC2AD"
                d="M18 25.823a.75.75 0 0 1-.75-.75V2.792a.75.75 0 0 1 1.5 0v22.281a.75.75 0 0 1-.75.75z"
              ></path>
            </svg>
          </CardDataStats>
          <CardDataStats title="Total Collection" total={data[0] ? data[0]['Total Donation Amount'] || 0 : 0} rate="">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                fill=""
              />
              <path
                d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
                fill=""
              />
            </svg>
          </CardDataStats>
          <CardDataStats title="Total Users" total={data[0]['Number of Users Registered']} rate="">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="18"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                fill=""
              />
              <path
                d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                fill=""
              />
              <path
                d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                fill=""
              />
            </svg>
          </CardDataStats>
        </div>

        {referrals.length > 0 ? (
          <div>
            <div className="grid grid-cols-4 rounded-sm bg-white sm:grid-cols-4">
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  User Name
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Number of Referrals
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Total Referral Donations
                </h5>
              </div>
            </div>

            {referrals.map((referral, index) => (
              <div
                className={`grid grid-cols-4 sm:grid-cols-4 ${index === referrals.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
                key={referral.user_id}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{referral['User Name']}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{referral['Number of Referrals'] || 0}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{referral['Total Referral Donations'] || 0}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-500 dark:text-gray-400">No referral data available</p>
          </div>
        )}
      </DefaultLayout>
    </>
  );
};

export default dashboard;
