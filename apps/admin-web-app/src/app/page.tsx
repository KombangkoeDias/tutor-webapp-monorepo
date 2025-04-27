import Image from "next/image";

import { Loader2 } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-800">
        Dashboard is Coming Soon
      </h1>
      <p className="mb-8 text-xl text-gray-600">
        We're working hard to bring you something amazing. Please check back
        soon!
      </p>
      <div className="flex items-center justify-center space-x-2 text-blue-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-lg font-medium">In Progress...</span>
      </div>
    </div>
  );
}
