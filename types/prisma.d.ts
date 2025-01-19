import { Prisma } from '@prisma/client';

type AttendenceWithCheckLog = Prisma.AttendenceGetPayload<{
  include: { checkLog: true }
}>;

declare global {
  namespace PrismaJson {
    type AttendenceWithCheckLog = AttendenceWithCheckLog;
  }
}

