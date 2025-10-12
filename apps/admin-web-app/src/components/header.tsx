"use client";

import { JWT_TOKEN_KEY } from "@/chulatutordream/services/http-client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLoggedIn } from "@/components/hooks/login-context";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Dropdown, MenuProps } from "antd";
import {
  DownOutlined,
  HddOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ChildProcess } from "child_process";

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const NotLoggedInNavigation: any[] = [];

const LoggedInNavigation = [
  { name: "Dashboard", href: "/" },
  { name: "เพิ่ม Tag/วิชา", href: "/constants" },
];

// Job Management Dropdown
const jobManagementItems = [
  {
    name: "ดูงานทั้งหมด (รายละเอียด)",
    href: "/job/all",
    disabled: false,
    icon: <HddOutlined />,
  },
  {
    name: "ดูงานที่จองได้ทั้งหมด",
    href: "/job/list",
    disabled: false,
    icon: <HddOutlined />,
  },
  {
    name: "copy งานที่จองได้",
    href: "/job/copy",
    disabled: false,
    icon: <HddOutlined />,
  },
  {
    name: "ดู referral code/ สร้าง link ที่มี referral code",
    href: "/job/referral",
    disabled: false,
    icon: <HddOutlined />,
  },
];

// Tutor Management Dropdown
const tutorManagementItems = [
  {
    name: "ดูติวเตอร์ทั้งหมด/ รีวิวติวเตอร์",
    href: "/tutor/list",
    disabled: false,
    icon: <UserOutlined />,
  },
  {
    name: "คืนเงินติวเตอร์",
    href: "/tutor/refund",
    disabled: false,
    icon: <UserOutlined />,
  },
];

// Financial Management Dropdown
const financialManagementItems = [
  {
    name: "รีวิว slip โอนเงินค่าแนะนำ",
    href: "/reservations/slip",
    disabled: false,
    icon: <p>⏳</p>,
  },
];

// Helper function to create dropdown items
const createDropdownItems = (items: any[]): MenuProps["items"] => {
  return items.map((item, index) => {
    return {
      key: index.toString(),
      label: (
        <a
          key={index.toString()}
          href={item.href}
          className="rounded-md px-3 py-2 text-sm font-medium"
        >
          {item.name}
        </a>
      ),
      icon: item.icon,
      disabled: item.disabled,
      type: item.type,
      children: item.children,
    };
  });
};

const jobManagementDropdownItems = createDropdownItems(jobManagementItems);
const tutorManagementDropdownItems = createDropdownItems(tutorManagementItems);
const financialManagementDropdownItems = createDropdownItems(
  financialManagementItems
);

export default function Header() {
  const { loggedIn, setLoggedIn } = useLoggedIn();
  const [navigation, setNavigation] = useState(
    loggedIn ? LoggedInNavigation : NotLoggedInNavigation
  );

  const pathName = usePathname();

  useEffect(() => {
    setNavigation(loggedIn ? LoggedInNavigation : NotLoggedInNavigation);
  }, [loggedIn]);

  function getNavbarList() {
    const nav = navigation.map((item) => (
      <a
        key={item.name}
        href={item.href}
        aria-current={item.href === pathName ? "page" : undefined}
        className={classNames(
          item.href === pathName
            ? "bg-gray-900 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white",
          "rounded-md px-3 py-2 text-sm font-medium"
        )}
      >
        {item.name}
      </a>
    ));

    if (loggedIn) {
      // Add Job Management dropdown
      nav.push(
        <Dropdown
          menu={{ items: jobManagementDropdownItems }}
          key="job-management"
        >
          <a className="text-white text-sm rounded-md px-3 py-2 cursor-pointer">
            จัดการงาน <DownOutlined />
          </a>
        </Dropdown>
      );

      // Add Tutor Management dropdown
      nav.push(
        <Dropdown
          menu={{ items: tutorManagementDropdownItems }}
          key="tutor-management"
        >
          <a className="text-white text-sm rounded-md px-3 py-2 cursor-pointer">
            จัดการติวเตอร์ <DownOutlined />
          </a>
        </Dropdown>
      );

      // Add Financial Management dropdown
      nav.push(
        <Dropdown
          menu={{ items: financialManagementDropdownItems }}
          key="financial-management"
        >
          <a className="text-white text-sm rounded-md px-3 py-2 cursor-pointer">
            การเงิน <DownOutlined />
          </a>
        </Dropdown>
      );
    }

    return nav;
  }

  return (
    <Disclosure as="nav" className="bg-gray-800 sticky top-0 z-50">
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
              <p className="ml-2 text-lg" style={{ color: "white" }}>
                Admin
              </p>
            </div>
            <div className="hidden md:ml-auto md:block">
              <div className="flex space-x-4">
                {getNavbarList()}
                {/* {navigation
                  .map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.href === pathName ? "page" : undefined}
                      className={classNames(
                        item.href === pathName
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </a>
                  ))
                  .splice(
                    1,
                    0,
                    <Dropdown menu={{ items }}>
                      <a
                        key={"dropdown"}
                        className="text-white text-sm rounded-md px-3 py-2 cursor-pointer"
                      >
                        จัดการข้อมูลติวเตอร์,นักเรียน <DownOutlined />
                      </a>
                    </Dropdown>
                  )} */}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button> */}

            {/* Profile dropdown */}
            {loggedIn && (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  {/* <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Settings
                    </a>
                  </MenuItem> */}
                  <MenuItem>
                    <a
                      onClick={() => {
                        localStorage?.removeItem(JWT_TOKEN_KEY);
                        setLoggedIn(false);
                      }}
                      style={{ cursor: "pointer" }}
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      ออกจากระบบ
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
            {!loggedIn && (
              <>
                <Link href="/login" className="mr-2">
                  <Button
                    variant="outline"
                    className="border-[#FFAEF8] bg-gray-800  hover:bg-[#FFAEF8] text-white"
                  >
                    เข้าสู่ระบบ{" "}
                  </Button>{" "}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="md:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {getNavbarList().map((item) => item)}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
