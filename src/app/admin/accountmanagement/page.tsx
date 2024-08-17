"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";

// Dynamically load the Table component with loader and SSR disabled
const Table = dynamic(() => import("@/components/Tables/AccountMui/TS"), {
  ssr: false,
  loading: () => <Loader />, // Show Loader while the component is loading
});

const AccountTable: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // When the component mounts, we start the loading process
  useEffect(() => {
    setLoading(true);
  }, []);

  // Once the table component has mounted, we stop showing the loader
  useEffect(() => {
    const handleTableLoad = () => {
      setLoading(false);
    };

    // Simulate table load completion by using a timeout or other logic here.
    // If Table has any event or lifecycle to detect the loading completion, we can place that logic here.
    const timer = setTimeout(handleTableLoad, 1000); // You can adjust the timing or condition to your needs

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, []);

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Account Management" />

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <div className="col-span-12 xl:col-span-12">
            {loading ? (
              <Loader />
            ) : (
              <div style={{ display: loading ? "none" : "block" }}>
                <Table />
              </div>
            )}
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default AccountTable;