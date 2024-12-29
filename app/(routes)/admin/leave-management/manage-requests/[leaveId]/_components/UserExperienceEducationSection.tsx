import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Education, JobExperience, UserProfile } from "@prisma/client";
import { format } from "date-fns";

interface UserExperienceEducationSectionProps {
  userExperiences: (UserProfile & { jobExperiences: JobExperience[] }) | null;
  userEducations: (UserProfile & { educations: Education[] }) | null;
}

const UserExperienceEducationSection = ({
  userExperiences,
  userEducations,
}: UserExperienceEducationSectionProps) => {
  return (
    <div className='w-full flex flex-col gap-10 px-5 py-7 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
      <div className='flex flex-col gap-4'>
        <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
          Experiences
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userExperiences?.jobExperiences.map((item) => {
              const startDateFormatted = item.startDate
                ? format(new Date(item.startDate), "MMM yyyy")
                : "";
              const endDateFormatted = item.endDate
                ? format(new Date(item.endDate), "MMM yyyy")
                : "";
              const duration =
                item.startDate && item.endDate && !item.currentlyWorking
                  ? `${endDateFormatted} - ${startDateFormatted}`
                  : `${startDateFormatted} - Present`;

              return (
                <TableRow key={item.id}>
                  <TableCell>{item.jobTitle}</TableCell>
                  <TableCell>{item.companyName}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{duration}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-col gap-4'>
        <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
          Educations
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>University</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>Field Of Study</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userEducations?.educations.map((item) => {
              const startDateFormatted = item.startDate
                ? format(new Date(item.startDate), "MMM yyyy")
                : "";
              const endDateFormatted = item.endDate
                ? format(new Date(item.endDate), "MMM yyyy")
                : "";
              const duration =
                item.startDate && item.endDate && !item.currentlyStudying
                  ? `${endDateFormatted} - ${startDateFormatted}`
                  : `${startDateFormatted} - Present`;

              return (
                <TableRow key={item.id}>
                  <TableCell>{item.university}</TableCell>
                  <TableCell>{item.degree}</TableCell>
                  <TableCell>{item.fieldOfStudy}</TableCell>
                  <TableCell>{duration}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserExperienceEducationSection;
