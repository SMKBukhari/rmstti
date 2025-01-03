import { db } from "../lib/db.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface EmployeeData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  gender: "Male" | "Female" | "Other";
  contactNumber: string;
  email: string;
  hireDate: Date | null;
  position: string;
  salary: number | null;
  address: string | null;
  img: string | null;
  employmentStatus: string;
}

async function migrateEmployees(): Promise<void> {
  try {
    console.log("Reading SQL file...");
    const sqlContent = await fs.readFile(
      path.join(__dirname, "erp786.sql"),
      "utf8"
    );

    console.log("Processing SQL content...");
    const lines = sqlContent.split("\n");
    const employees: EmployeeData[] = [];

    const insertRegex = /INSERT INTO `employees` VALUES\s*\((.+)\);/;

    for (let line of lines) {
      line = line.trim();

      const match = line.match(insertRegex);
      if (match) {
        console.log(
          "Found employee insert line:",
          line.substring(0, 50) + "..."
        );

        // Extract values
        const valuesString = match[1];
        const values = valuesString
          .split(/,(?=(?:[^']*'[^']*')*[^']*$)/) // Split considering quoted strings
          .map((value) =>
            value.trim().replace(/^'|'$/g, "").replace(/\\'/g, "'")
          ); // Remove quotes and escape sequences

        // Clean and map values to the EmployeeData structure
        const employee: EmployeeData = {
          firstName: values[1] || "",
          lastName: values[2] || "",
          dateOfBirth: values[3] ? new Date(values[3]) : null,
          gender:
            values[4]?.toLowerCase() === "male"
              ? "Male"
              : values[4]?.toLowerCase() === "female"
              ? "Female"
              : "Other",
          contactNumber: values[5] || "",
          email: values[6] || "",
          hireDate: values[7] ? new Date(values[7]) : null,
          position: values[8] || "",
          salary: values[9] ? parseFloat(values[9]) : null,
          address: values[10] || null,
          img: values[12] || null,
          employmentStatus: values[33] === "Active" ? "Active" : "Former",
        };

        employees.push(employee);
        console.log(
          `Parsed employee: ${employee.firstName} ${employee.lastName}`
        );
      }
    }

    console.log(`Found ${employees.length} employees to migrate`);

    const applicationStatus = await db.applicationStatus.findFirst({
      where: { name: "Hired" },
    });

    const role = await db.role.findFirst({
      where: { name: "Employee" },
    });
    // Insert employees into the database
    for (const employee of employees) {
      try {
        await db.userProfile.create({
          data: {
            fullName: `${employee.firstName} ${employee.lastName}`,
            email:
              employee.email === "N/A"
                ? `${employee.firstName.toLowerCase()}@example.com`
                : employee.email,
            password: "12345678",
            ConfirmPassword: "12345678",
            role: {
              connect: {
                id: role?.id,
              },
            },
            gender: employee.gender,
            contactNumber: employee.contactNumber || "",
            DOB: employee.dateOfBirth,
            userImage: employee.img,
            designation: employee.position,
            DOJ: employee.hireDate,
            salary: employee.salary?.toString(),
            status: {
              connectOrCreate: {
                where: { name: employee.employmentStatus },
                create: { name: employee.employmentStatus },
              },
            },
            applicationStatus: {
              connect: {
                id: applicationStatus?.id,
              },
            },
            isVerified: true,
            isHired: true,
          },
        });
        console.log(
          `Successfully migrated: ${employee.firstName} ${employee.lastName}`
        );
      } catch (error) {
        console.error(
          `Failed to migrate employee ${employee.firstName}:`,
          error
        );
      }
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

// Execute the migration
migrateEmployees().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
