const readline = require("readline");
const { PrismaClient } = require("@prisma/client");

type SeedOption = keyof typeof options;

const database = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const workStatusSeed = async () => {
  try {
    await database.WorkStatus.createMany({
      data: [
        { name: "On Leave" },
        { name: "On Site" },
        { name: "Work From Home" },
        { name: "Half Day" },
      ],
    });
    console.log("Work statuses seeded successfully.");
  } catch (error) {
    console.log(`Error on seeding work statuses: ${error}`);
  }
};

const statusSeed = async () => {
  try {
    await database.status.createMany({
      data: [
        { name: "Active" },
        { name: "Resigned" },
        { name: "Terminated" },
      ],
    });
    console.log("Statuses seeded successfully.");
  } catch (error) {
    console.log(`Error on seeding statuses: ${error}`);
  }
};

const applicationStatusSeed = async () => {
  try {
    await database.ApplicationStatus.createMany({
      data: [
        { name: "Applied" },
        { name: "Shortlisted" },
        { name: "Interviewed" },
        { name: "Rejected" },
        { name: "Hired" },
      ],
    });
    console.log("Application statuses seeded successfully.");
  } catch (error) {
    console.log(`Error on seeding application statuses: ${error}`);
  }
};

const roleSeed = async () => {
  try {
    await database.role.createMany({
      data: [
        { name: "User" },
        { name: "Admin" },
        { name: "Manager" },
        { name: "Employee" },
        { name: "CEO" },
      ],
    });
    console.log("Roles seeded successfully.");
  } catch (error) {
    console.log(`Error on seeding roles: ${error}`);
  }
};

const options = {
  1: workStatusSeed,
  2: statusSeed,
  3: applicationStatusSeed,
  4: roleSeed,
} as const;

console.log("Select an option to seed the database:");
console.log("1: Work Status");
console.log("2: Status");
console.log("3: Application Status");
console.log("4: Role");

rl.question("Enter your choice: ", (choice: string) => {
  const seedFunction = options[parseInt(choice) as SeedOption];
  if (seedFunction) {
    seedFunction()
      .catch((error) => console.error(error))
      .finally(() => {
        database.$disconnect();
        rl.close();
      });
  } else {
    console.log("Invalid choice. Please try again.");
    rl.close();
  }
});
