import Image from "next/image";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

function StatsSection() {
  const tutorNumber = 124;
  const jobNumber = 531;
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div>
            <h3 className="text-[#717171] text-2xl mb-2">
              จำนวนติวเตอร์ที่ร่วมงานกับเรา
            </h3>
            <div ref={ref} className="text-6xl font-bold text-[#263238] mb-2">
              {inView ? (
                <CountUp start={0} end={tutorNumber} duration={1} />
              ) : (
                <>{tutorNumber}</>
              )}
            </div>
            <div className="text-[#4caf4f]">+30% ในเดือนนี้</div>
          </div>
          <div>
            <h3 className="text-[#717171] text-2xl mb-2">จำนวนงานทั้งหมด</h3>
            <div className="text-6xl font-bold text-[#263238] mb-2">
              {inView ? (
                <CountUp start={0} end={jobNumber} duration={2} />
              ) : (
                <>{jobNumber}</>
              )}
            </div>
            <div className="text-[#4caf4f]">+15% ในเดือนนี้</div>
          </div>
        </div>
      </div>
      <CenterLogo />
    </>
  );
}

function CenterLogo() {
  const { ref, inView } = useInView({ triggerOnce: true });
  const totalDays = 3;
  const totalIncome = 3000000;
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold text-[#263238] mb-8">
        มาเป็นส่วนหนึ่งของครอบครัวเรา
      </h2>
      <Image
        src="/logo.png"
        alt="Job Tutor Dream"
        width={300}
        height={80}
        className="mx-auto mb-12"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
        <div>
          <div className="text-[#717171] text-2xl mb-4">
            เวลาเฉลี่ยในการดีลงาน นับตั้งแต่นักเรียนสร้างงาน
            <br />
            จนถึงติวเตอร์ได้งาน
          </div>
          <div ref={ref} className="text-6xl font-bold text-[#263238]">
            {inView ? (
              <CountUp start={0} end={totalDays} duration={1} />
            ) : (
              <>{totalDays}</>
            )}{" "}
            วัน
          </div>
        </div>
        <div>
          <div className="text-[#717171] text-2xl mb-4">
            รายได้ที่สร้างให้ติวเตอร์รวม
          </div>
          <div className="text-6xl font-bold text-[#263238]">
            ฿{" "}
            {inView ? (
              <CountUp start={0} end={totalIncome} duration={2} />
            ) : (
              <>{totalIncome}</>
            )}{" "}
            +
          </div>
          <div className="text-[#4caf4f]">+30% ในเดือนนี้</div>
        </div>
      </div>
    </div>
  );
}

export default StatsSection;
