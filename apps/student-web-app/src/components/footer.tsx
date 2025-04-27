import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#F8D3DA] text-black py-12">
      <div className="px-4">
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 flex justify-center`}
        >
          <div>
            <Image
              src="/logo.png" // Path to your image (local or external URL)
              alt="logo"
              width={130} // Set the width of the image
              height={60}
            />
            <h3 className="font-bold mb-4">Chula Tutor Dream</h3>
            <p className="text-sm text-gray-400">Copyright © 2025</p>
            <p className="text-sm text-gray-400">All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
