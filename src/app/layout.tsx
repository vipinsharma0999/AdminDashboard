"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import Notifications from "../components/Notifications";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login page if token is not present
      setLoading(false);
    } else {
      setLoading(false);
    }

    // To show loader on route changes
    // const handleRouteChangeStart = () => setLoading(true);
    // const handleRouteChangeComplete = () => setLoading(false);

    // router.events.on("routeChangeStart", handleRouteChangeStart);
    // router.events.on("routeChangeComplete", handleRouteChangeComplete);

    // return () => {
    //   router.events.off("routeChangeStart", handleRouteChangeStart);
    //   router.events.off("routeChangeComplete", handleRouteChangeComplete);
    // };
  }, [router]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : children}
          <Notifications />
        </div>
      </body>
    </html>
  );
}
