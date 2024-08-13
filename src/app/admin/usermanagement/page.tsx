"use client";
import dynamic from "next/dynamic";
//import TableOne from "@/components/Tables/TableOne";
import CardDataStats from "@/components/CardDataStats";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";

const Main = dynamic(() => import("@/components/Tables/UserMui/TS"), {
  loading: () => <Loader />,
  ssr: false, // Disable SSR for this component to ensure the loader works properly
});

const donatointable2 = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Adjust the delay as needed

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, []);

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="User Management" />

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <div className="col-span-12 xl:col-span-12">
            {loading ? (
              <Loader />
            ) : (
              <>
                <Main />
              </>
            )}
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default donatointable2;
