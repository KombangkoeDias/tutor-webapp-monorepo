"use client";
import React from "react";

import * as HeroComponentNotLoggedIn from "@/components/landing/not-logged-in/hero/component";
import StatsSection from "@/components/landing/not-logged-in/stats/components";
import Features from "@/components/landing/not-logged-in/features/component";
import Process from "@/components/landing/process";
import Dashboard from "@/components/landing/logged-in/dashboard";
import { VerifiedAlert } from "@/components/landing/logged-in/verified_alert";
import { Spinner } from "@/components/ui/spinner";
import { useLoggedIn } from "@/components/hooks/login-context";

export default function TutorLanding() {
  const { loggedIn, tutor, isLoading: isAuthenticating } = useLoggedIn();

  const verified = (tutor?.admin_verified && tutor.email_verified) ?? false;

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {loggedIn && <>{verified ? <Dashboard /> : <VerifiedAlert />}</>}
      {!loggedIn && (
        <>
          <HeroComponentNotLoggedIn.default />
          {/* <StatsSection /> */}
          <Features />
          <Process />
        </>
      )}
    </div>
  );
}

// const Dashboard = () => {
//   const targetNumber = 1000; // The number you want to animate to

//   return (
//     <div className="dashboard-container">
//       <h1 className="text-2xl font-semibold">Dashboard</h1>
//       <div className="counter-display">
//         <h2 className="text-xl font-bold">
//           Animated Number: <CountUp start={0} end={targetNumber} duration={1} />
//         </h2>
//       </div>
//     </div>
//   );
// };
