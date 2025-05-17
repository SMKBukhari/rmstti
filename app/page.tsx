"use client";
import Navbar from "@/components/LandingPage/Navbar";
import Hero from "@/components/LandingPage/Hero";
import Footer from "@/components/LandingPage/Footer";
import JobListings from "@/components/LandingPage/JobListings";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/jobs");
      const jobsData = response.data;
      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow'>
        <Hero />
        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
          </div>
        ) : (
          <JobListings jobs={jobs} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
