"use client";
// import QRCode from "react-qr-code";
import React from "react";
import { useQRCode } from "next-qrcode";

interface EmployeeQRCodeProps {
  employeeId: string;
}

const EmployeeQRCode = ({ employeeId }: EmployeeQRCodeProps) => {
  const { Canvas } = useQRCode();
  const qrValue = `${process.env.NEXT_PUBLIC_APP_URL}/${employeeId}`;
  return (
    <div className='flex flex-col items-center p-4 border rounded-lg shadow-md'>
      <Canvas
        text={qrValue}
        options={{
          errorCorrectionLevel: "M",
          margin: 3,
          scale: 4,
          width: 200,
        }}
        logo={{
          src: "/img/logo_dark_tti.svg",
          options: {
            width: 50,
            x: undefined,
            y: undefined,
          },
        }}
      />
      <p className='mt-2 text-sm text-gray-600'>
        Scan to view employee profile
      </p>
    </div>
  );
};

export default EmployeeQRCode;
