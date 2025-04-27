"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname, useSearchParams } from "next/navigation";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const jobId = searchParams.get("jobId");

  const navigation = [
    { name: "หน้าแรก", href: "/" },
    { name: "หาติวเตอร์", href: "/jobs/create" },
    code && jobId
      ? {
          name: "เลือกติวเตอร์",
          href: `/jobs/reservation/list?code=${code}&jobId=${jobId}`,
        }
      : null,
  ].filter(Boolean);
  return (
    <Disclosure as="nav" className="bg-[#F8D3DA] sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="hidden sm:flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <Image
                  src="/logo.png" // Path to your image (local or external URL)
                  alt="logo"
                  width={130} // Set the width of the image
                  height={60}
                />
              </Link>
            </div>
            <div className="hidden ml-2 md:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item?.name}
                    href={item?.href}
                    aria-current={
                      item?.href?.split("?")[0] === pathName
                        ? "page"
                        : undefined
                    }
                    className={classNames(
                      item?.href?.split("?")[0] === pathName
                        ? "bg-[#DA70D6] text-white"
                        : "text-black hover:bg-[#FAA0A0] hover:text-white",
                      "ml-3 rounded-md px-3 py-2 text-lg font-medium"
                    )}
                  >
                    {item?.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DisclosurePanel className="md:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item?.name}
              as="a"
              href={item?.href}
              aria-current={
                item?.href?.split("?")[0] === pathName ? "page" : undefined
              }
              className={classNames(
                item?.href?.split("?")[0] === pathName
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item?.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
