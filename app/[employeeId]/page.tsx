import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CompanyHeader } from "./_components/CompanyHeader";
import { EmployeeHeader } from "./_components/EmployeeHeader";
import { ContactInfo } from "./_components/ContactInfo";
import { WorkInfo } from "./_components/WorkInfo";
import { CompanyInfo } from "./_components/CompanyInfo";

export default async function EmployeeQRScanPage({
  params,
}: {
  params: { employeeId: string };
}) {
  const employee = await db.userProfile.findUnique({
    where: {
      userId: params.employeeId,
    },
    include: {
      role: true,
      department: true,
      company: true,
    },
  });

  if (!employee) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Card className='p-6'>
          <h1 className='text-xl font-semibold text-red-600'>
            Employee not found
          </h1>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-4 md:p-8'>
      <div className='max-w-4xl mx-auto'>
        <Card className='overflow-hidden'>
          <CompanyHeader
            name={employee.company?.name ?? "The Truth International"}
            logo={employee.company?.logo ?? ""}
          />
          <EmployeeHeader
            fullName={employee.fullName}
            designation={employee.designation ?? ""}
            imageUrl={employee.userImage ?? ""}
          />

          <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <ContactInfo
                email={employee.email}
                contactNumber={employee.contactNumber}
              />
              <WorkInfo
                role={employee.role?.name ?? ""}
                department={employee.department?.name ?? ""}
              />
            </div>

            <Separator className='my-8' />

            <CompanyInfo
              name={employee.company?.name ?? "The Truth International"}
              address={
                employee.company?.address ??
                "205 (D) Evacuee Trust Complex, Agha Khan Rd, F-5/1 F-5, Islamabad, Islamabad Capital Territory"
              }
              contact={employee.company?.contact ?? "0512820180"}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
