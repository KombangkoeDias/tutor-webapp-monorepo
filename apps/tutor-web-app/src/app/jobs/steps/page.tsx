import Image from "next/image";
import React from "react";

export default function JobStepsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-[#263238] mb-12">
        ขั้นตอนการจองงานบนเว็บ Job Tutor Dream
      </h2>
      <div className="flex justify-center">
        <Image
          src="/pics/process.png" // Path to your image (local or external URL)
          alt="process"
          width={1000} // Set the width of the image
          height={1000}
        />
      </div>
    </div>
  );
}
