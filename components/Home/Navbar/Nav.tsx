"use client";

import { navLinks } from '@/Constant/constant'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { HiBars3BottomRight } from 'react-icons/hi2'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from "next-auth/react"

interface NavProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  alwaysBlue?: boolean
}

const Nav = ({ setOpen, alwaysBlue = false }: NavProps) => {
  const [navBg, setNavBg] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const isHomePage = pathname === "/"

  useEffect(() => {
    if (!isHomePage) return;

    const handler = () => {
      setNavBg(window.scrollY >= 90)
    }

    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [isHomePage])

  // Define the common link style to match your MobileNav
  const commonLinkStyle = `relative text-white text-[18px] font-medium !no-underline 
    after:block after:absolute after:h-[3px] after:bg-[#C39B50] 
    after:w-full after:scale-x-0 hover:after:scale-x-100 
    after:transition after:duration-300 after:origin-left after:-bottom-1 hover:text-[#C39B50] transition-colors`;

  return (
    <div
      className={`fixed top-0 left-0 w-full h-[12vh] z-[1000] flex transition-all duration-300
      ${!isHomePage || alwaysBlue || navBg ? 'bg-blue-400 shadow-lg' : 'bg-transparent'}`}
    >
      <div className='flex items-center h-full justify-between w-[90%] xl:w-[80%] mx-auto'>

        {/* Logo */}
        <Link href="/">
          <img src="/image/Adobe Express - file.png" alt="logo"
            className="w-20 h-20 object-contain cursor-pointer" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => {
            // Updated Sign Up / Profile to use the same hover effect as others
            if (link.label === "Sign Up") {
              return (
                <Link 
                  key={link.id} 
                  href={!session ? link.url : "/profile"} 
                  className={commonLinkStyle}
                >
                  {!session ? "Sign Up" : "Profile"}
                </Link>
              )
            }

            return (
              <Link
                key={link.id}
                href={link.url}
                className={commonLinkStyle}
              >
                {link.label}
              </Link>
            )
          })}

          {session && (
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 text-whitefont-bold px-6 py-2 rounded-3xl text-[18px] transition-colors ml-4"
            >
              Log out
            </button>
          )}
        </div>

        {/* Burger */}
        <HiBars3BottomRight
          onClick={() => setOpen(true)}
          className='w-8 h-8 text-white lg:hidden cursor-pointer hover:text-[#C39B50] transition-colors'
        />
      </div>
    </div>
  )
}

export default Nav