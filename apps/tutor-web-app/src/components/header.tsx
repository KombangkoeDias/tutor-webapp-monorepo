"use client";

import { JWT_TOKEN_KEY } from "@/services/http-client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  UserIcon,
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useLoggedIn } from "./hooks/login-context";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ProfilePictureUploader from "./shared/profile_pic";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NotLoggedInNavigation = [
  { name: "หน้าแรก", href: "/" },
  { name: "งานสอนพิเศษทั้งหมด", href: "/jobs" },
  { name: "ขั้นตอนการรับงาน", href: "/jobs/steps" },
  { name: "ติดต่อทีมงาน", href: "/contact_us" },
];

const LoggedInNavigation = [
  { name: "หน้าแรก", href: "/" },
  { name: "งานสอนพิเศษทั้งหมด", href: "/jobs" },
  { name: "ประวัติการจองงาน", href: "/reservation/history" },
  { name: "ขั้นตอนการรับงาน", href: "/jobs/steps" },
  { name: "ติดต่อทีมงาน", href: "/contact_us" },
];

export default function Header() {
  const { loggedIn, setLoggedIn, tutor } = useLoggedIn();
  const [navigation, setNavigation] = useState(
    loggedIn ? LoggedInNavigation : NotLoggedInNavigation
  );
  const [scrolled, setScrolled] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    setNavigation(loggedIn ? LoggedInNavigation : NotLoggedInNavigation);
  }, [loggedIn]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Get user's display name from tutor object
  const getUserDisplayName = () => {
    if (!tutor) return "ผู้ใช้งาน";

    // Otherwise use first name
    if (tutor.name) return tutor.name;

    // Fallback to email or generic name
    return tutor.email || "ผู้ใช้งาน";
  };

  return (
    <Disclosure
      as="nav"
      className={`sticky top-0 z-50 transition-all duration-300 bg-gray-800 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset transition-all duration-200">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon
                    aria-hidden="true"
                    className="block size-6 group-data-open:hidden transition-opacity duration-300"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden size-6 group-data-open:block transition-opacity duration-300"
                  />
                </DisclosureButton>
              </div>

              <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                <div className="flex items-center">
                  <Link href="/" className="mr-2 relative group">
                    <div className="absolute -inset-1 rounded-lg"></div>
                    <div className="relative">
                      <Image
                        src="/logo.png"
                        alt="logo"
                        width={130}
                        height={100}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="hidden md:ml-auto md:block">
                    <div className="flex space-x-1">
                      {navigation.map((item) => (
                        <div key={item.name}>
                          <Link
                            href={item.href}
                            aria-current={
                              item.href === pathName ? "page" : undefined
                            }
                            className={classNames(
                              item.href === pathName
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "relative group rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center"
                            )}
                          >
                            {item.name}
                            {item.href === pathName && (
                              <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-400"
                                layoutId="navbar-underline"
                                transition={{
                                  type: "spring",
                                  bounce: 0.2,
                                  duration: 0.6,
                                }}
                              />
                            )}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {loggedIn && (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden transition-transform duration-200 hover:scale-110">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <div className="relative">
                          <div className="absolute -inset-0.5 rounded-full bg-pink-400/50 opacity-75 blur-sm animate-pulse"></div>
                          <ProfilePictureUploader
                            onSave={() => {}}
                            readOnly={true}
                            profilePage={false}
                            defaultOriginalImage={tutor?.profile_pic_original}
                            defaultCropSettings={JSON.parse(
                              tutor?.profile_pic_crop_setting ?? "{}"
                            )}
                            size="ss"
                          />
                        </div>
                      </MenuButton>
                    </div>
                    <AnimatePresence>
                      <MenuItems
                        as={motion.div}
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden"
                      >
                        {/* User name display */}
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            สวัสดี, {getUserDisplayName()}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {tutor?.email}
                          </p>
                        </div>

                        <MenuItem>
                          {({ active }) => (
                            <Link
                              href="/tutor/profile"
                              className={`block px-4 py-2 text-sm ${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700"
                              } transition-colors duration-150`}
                            >
                              <UserIcon className="w-4 h-4 inline-block mr-2" />{" "}
                              โปรไฟล์
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <a
                              onClick={() => {
                                localStorage?.removeItem(JWT_TOKEN_KEY);
                                setLoggedIn(false);
                              }}
                              style={{ cursor: "pointer", color: "red" }}
                              className={`block px-4 py-2 text-sm ${
                                active
                                  ? "bg-red-50 text-red-700"
                                  : "text-gray-700"
                              } transition-colors duration-150`}
                            >
                              <ArrowLeftEndOnRectangleIcon className="w-4 h-4 inline-block mr-2" />
                              ออกจากระบบ
                            </a>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </AnimatePresence>
                  </Menu>
                )}

                {!loggedIn && (
                  <div className="flex items-center space-x-2">
                    <Link href="/tutor/login">
                      <Button
                        variant="outline"
                        className="border-[#FFAEF8] bg-gray-800 hover:bg-[#FFAEF8]/20 text-white transition-all duration-300"
                      >
                        <span className="relative z-10">
                          เข้าสู่ระบบติวเตอร์
                        </span>
                      </Button>
                    </Link>
                    <Link href="/tutor/signup">
                      <Button className="bg-[#4CAF50] hover:bg-[#45a049] text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                        สมัครติวเตอร์
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <DisclosurePanel
                as={motion.div}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <div className="space-y-1 px-2 pt-2 pb-3">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <DisclosureButton
                        as={Link}
                        href={item.href}
                        aria-current={
                          item.href === pathName ? "page" : undefined
                        }
                        className={classNames(
                          item.href === pathName
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200"
                        )}
                      >
                        {item.name}
                      </DisclosureButton>
                    </div>
                  ))}
                </div>
              </DisclosurePanel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
