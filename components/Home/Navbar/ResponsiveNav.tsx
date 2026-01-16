"use client";
import React, { useState } from 'react'
import Nav from './Nav'
import MobileNav from './MobileNav'
import { usePathname } from 'next/navigation'

const ResponsiveNav = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Home page scroll effect, all others always blue
  const alwaysBlue = pathname !== '/'

  return (
    <div>
      <Nav open={open} setOpen={setOpen} alwaysBlue={alwaysBlue} />
      <MobileNav open={open} setOpen={setOpen} />
    </div>
  )
}

export default ResponsiveNav
