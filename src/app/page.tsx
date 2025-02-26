"use client";

import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import { UserProvider, useUser } from "../context/UserContext"; // Import UserProvider dan useUser

import { AppProps } from "next/app";

function MyAppContent({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, setUserRole } = useUser(); // Menggunakan user context

  useEffect(() => {
    let isMounted = true; // Flag untuk mencegah memory leak

    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/users"); // Mengambil data user dari API
        if (response.data?.user && isMounted) {
          setUser(response.data.user);

          // Mengambil role user dari API berdasarkan ID pengguna
          const roleResponse = await axios.get(`/api/users/${response.data.user.id}/role`);
          if (roleResponse.data?.role_id && isMounted) {
            setUserRole(roleResponse.data.role_id);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();

    // Timeout untuk loading
    const timer = setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer); // Cleanup timeout
    };
  }, [setUser, setUserRole]); // Dependensi hanya fungsi setter dari context

  if (isLoading) return <LoadingSpinner />;

  return (
    <UserProvider>
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </UserProvider>
  );
}

function MyApp(props: AppProps) {
  return (
    <UserProvider>
      <MyAppContent {...props} />
    </UserProvider>
  );
}

export default MyApp;
