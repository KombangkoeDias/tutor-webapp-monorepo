import Image from "next/image";

export default function Process() {
  return (
    <div className="h-[1200px] md:h-[800px] bg-white">
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#263238] mb-12">
          ขั้นตอนการหาติวเตอร์บนเว็บ Chula Tutor Dream
        </h2>
        <div className="grid grid-cols-1 max-w-4xl mx-auto">
          <div className="flex justify-center gap-4">
            <div className="bg-[#f5f7fa] p-4 rounded-lg">
              <Image
                src="/pics/process.png" // Path to your image (local or external URL)
                alt="process"
                width={1000} // Set the width of the image
                height={1000}
                className="border-2 border-[#FCC5F8] rounded-[20px] "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
