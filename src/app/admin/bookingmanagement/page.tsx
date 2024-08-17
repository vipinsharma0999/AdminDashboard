"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";

// Dynamically load the Main component with loader and SSR disabled
const Main = dynamic(() => import("@/components/Tables/BookingMui/TS"), {
  ssr: false,
  loading: () => <Loader />, // Show Loader while the component is loading
});

const BookingTable: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Start loading process when component mounts
  useEffect(() => {
    setLoading(true);
  }, []);

  // Stop loading once the Main component is fully loaded
  useEffect(() => {
    const handleMainLoad = () => {
      setLoading(false);
    };

    // Simulate Main component load completion
    const timer = setTimeout(handleMainLoad, 2000); // Adjust the timing or condition as needed

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Booking Management" />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-12">
          {loading ? (
            <Loader />
          ) : (
            <div style={{ display: loading ? "none" : "block" }}>
              <Main />
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BookingTable;
