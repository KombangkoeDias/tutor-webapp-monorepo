import React from "react";
import Image from "next/image";
export default function ContactUsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-[#263238] mb-12">
        ติดต่อทีมงาน
      </h2>
      {/* line qr code */}
      <div className="flex justify-center">
        <Image src="/pics/line-qr.png" alt="line qr" width={200} height={200} />
      </div>
      <div className="flex justify-center">
        <p>กรุณาติดต่อทีมงานผ่าน Line, สแกน QR Code ด้านบน</p>
      </div>
      <p className="text-center">
        แนะนำให้ติดต่อผ่าน QR code เพื่อความสะดวกรวดเร็ว
      </p>
      <div className="mt-5">
        <p className="text-xs text-center">
          Contact Person: Chusma Trisuriyatumma
        </p>
        <p className="text-xs text-center">
          Address: 111/237 หมู่ที่ 3 ต.บางรักน้อย อ.เมืองนนทบุรี จ.นนทบุรี 11000
        </p>
        <p className="text-xs text-center">Phone: (+66) 0868965858</p>
        <p className="text-xs text-center">Email: jobtutordream@gmail.com</p>
      </div>
    </div>
  );
}
