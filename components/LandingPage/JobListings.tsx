"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Job } from "@prisma/client";
import { fadeInOut } from "@/animations";
import JobCardItem from "./JobCardItem";

interface JobListing {
  jobs: Job[] | null;
}

const JobListings = ({ jobs }: JobListing) => {
  return (
    <section className='flex w-full py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950'>
      <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-12'
        >
          <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl'>
            Featured Job/Internship Openings
          </h2>
          <p className='mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4'>
            Explore our latest job/internship opportunities and take the next step in your
            career.
          </p>
        </motion.div>
        {jobs ? (
          <AnimatePresence>
            <motion.div
              {...fadeInOut}
              layout
              className='grid gap-8 sm:grid-cols-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            >
              {jobs?.map((job) => (
                <>
                  <JobCardItem key={job.id} job={job} />
                </>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <p className="flex items-center justify-center">Jobs/Internships not available at this time.</p>
        )}
      </div>
    </section>
  );
};

export default JobListings;
