"use client";
import React from "react";
import { navLinks } from "@/Constant/constant";
import Link from "next/link";
import { CgClose } from "react-icons/cg";
import { useSession, signOut } from "next-auth/react";

interface MobileNavProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileNav = ({ open, setOpen }: MobileNavProps) => {
  const { data: session } = useSession();

  // Unified style for ALL menu items to ensure perfect alignment
  const linkStyle = "text-white text-[24px] ml-12 font-semibold hover:text-yellow-300 transition-all duration-300 w-fit";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/70 z-[1001] lg:hidden transition-all duration-300
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Side Menu Container */}
      <div
        className={`fixed top-0 left-0 h-full w-[70%] sm:w-[50%] bg-blue-400 z-[1050]
        flex flex-col justify-center space-y-8 transform transition-transform duration-500 shadow-2xl
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {navLinks.map((link) => {
          // Dynamic label for Auth link
          if (link.label === "Sign Up") {
            return (
              <Link
                key={link.id}
                href={!session ? link.url : "/profile"}
                onClick={() => setOpen(false)}
                className={linkStyle}
              >
                {!session ? "Sign Up" : "My Profile"}
              </Link>
            );
          }

          return (
            <Link
              key={link.id}
              href={link.url}
              onClick={() => setOpen(false)}
              className={linkStyle}
            >
              {link.label}
            </Link>
          );
        })}

        {/* Improved Logout Button: Fits perfectly with other links */}
        {session && (
          <button
            onClick={() => {
              signOut();
              setOpen(false);
            }}
            className="mt-10 self-center ml-0 bg-red-500 hover:bg-red-600 text-white text-[24px] px-12 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
          >
            Log out
          </button>
        )}

        {/* Close Icon */}
        <CgClose
          onClick={() => setOpen(false)}
          className="absolute top-8 right-8 w-8 h-8 text-white cursor-pointer hover:rotate-90 transition-transform duration-300"
        />
      </div>
    </>
  );
};

export default MobileNav;