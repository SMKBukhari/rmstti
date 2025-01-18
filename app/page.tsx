import Navbar from "@/components/LandingPage/Navbar";
import Hero from "@/components/LandingPage/Hero";
import Footer from "@/components/LandingPage/Footer";
import JobListings from "@/components/LandingPage/JobListings";
import { db } from "@/lib/db";

export default async function Home() {
  
  const jobs = await db.job.findMany({
    where: {
      isPusblished: true,
    }
  });

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow'>
        <Hero />
        <JobListings jobs={jobs} />
      </main>
      <Footer />
    </div>
  );
}
