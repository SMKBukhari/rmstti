import { db } from "@/lib/db";

const EmployeeQRScanPage = async ({
  params,
}: {
  params: { employeeId: string };
}) => {
  const employee = await db.userProfile.findUnique({
    where: {
      userId: params.employeeId,
    },
    include: {
      role: true,
      department: true,
    },
  });
  return (
    <div className='container mx-auto p-4'>
      <div className='bg-white shadow-md rounded-lg p-6'>
        <h1 className='text-2xl font-bold mb-4'>{employee?.fullName}</h1>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-gray-600'>Email:</p>
            <p>{employee?.email}</p>
          </div>
          <div>
            <p className='text-gray-600'>Contact:</p>
            <p>{employee?.contactNumber}</p>
          </div>
          <div>
            <p className='text-gray-600'>Designation:</p>
            <p>{employee?.designation}</p>
          </div>
          <div>
            <p className='text-gray-600'>Role:</p>
            <p>{employee?.role?.name}</p>
          </div>
          <div>
            <p className='text-gray-600'>Department:</p>
            <p>{employee?.department?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeQRScanPage;
