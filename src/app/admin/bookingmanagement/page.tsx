"use client";
import dynamic from "next/dynamic";
import React from "react";
//import TableOne from "@/components/Tables/TableOne";
import Main from "@/components/Tables/TableMui/TS";
import CardDataStats from "@/components/CardDataStats";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const donatointable2 = () => {
  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Booking Management" />

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <div className="col-span-12 xl:col-span-12">
            {/* <TableOne /> */}
            <Main />
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default donatointable2;
