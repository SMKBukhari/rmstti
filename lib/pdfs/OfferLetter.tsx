import Logo from "@/components/Logo";

interface OfferLetterProps {
  name: string;
  address: string;
  city: string;
  date: string;
  designation: string;
  salary: string;
  deadline: string;
}

const OfferLetter = ({
  name,
  address,
  city,
  date,
  designation,
  salary,
}: OfferLetterProps) => {
  return (
    <div id='offer-letter' className='p-8 border w-full'>
      <div className='w-full flex justify-center mb-28'>
        <Logo />
      </div>
      <div className='flex justify-between'>
        <div>
          <h2 className='text-xl font-bold'>Mr. {name}</h2>
          <p>{address}</p>
          <p>{city}</p>
        </div>
        <div>
          <p>Date: {date}</p>
        </div>
      </div>
      <div className='text-xl font-bold underline uppercase text-center mb-5'>
        Offer Letter as {designation}
      </div>
      <p className='text-justify'>
        With reference to your application / interview, I hearby offer you
        appointment as {designation} in our The Truth International Private
        Limited against following terms & conditions.
      </p>
      <div className='space-y-3 mb-10 mt-10'>
        <div className='grid grid-cols-12'>
          <h3 className='text-xl col-span-2 font-bold'>Place:</h3>
          <p className='col-span-10 text-justify'>
            You are required to serve anywhere as when needed by company to
            perfome its operations / business according to your experience and
            specialty.
          </p>
        </div>
        <div className='grid grid-cols-12'>
          <h3 className='text-xl col-span-2 font-bold'>Tenure:</h3>
          <p className='col-span-10 text-justify'>
            Initially three-month contract extendable for further period subject
            to the performance. AFTER PROBATION PERIOD OF THREE MONTHS.
          </p>
        </div>
        <div className='grid grid-cols-12'>
          <h3 className='text-xl col-span-2 font-bold'>Salary:</h3>
          <p className='col-span-10 text-justify'>Rs. {salary}/- per month.</p>
        </div>
        <div className='grid grid-cols-12'>
          <h3 className='text-xl col-span-2 font-bold'>Obligations:</h3>
          <p className='col-span-10 text-justify'>
            Any assignment given by then management. You will be responsible to
            perform company business in a good manner and within the timelines
            in the best company interest.
          </p>
        </div>
        <div className='grid grid-cols-12'>
          <h3 className='text-xl col-span-2 font-bold'>Leave:</h3>
          <p className='col-span-10 text-justify'>
            You will be entitled to monthly leave as per company policy.
          </p>
        </div>
        <div className='grid grid-cols-12'>
          <h3 className='text-xl col-span-2 font-bold'>Termination:</h3>
          <p className='col-span-10 text-justify'>
            Appointment can be terminated by either side with one month&apos;s
            advance notice.
          </p>
        </div>
        <div className='grid grid-cols-12'>
          <h3 className='text-xl col-span-2 font-bold'>Other issues:</h3>
          <p className='col-span-10 text-justify'>
            Any other issue arises from time to time shall be dealt in
            accordance with the company policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferLetter;
