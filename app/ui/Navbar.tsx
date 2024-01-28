'use client';
import Link from "next/link";
import React, { useState } from "react";
import { useTheme } from '@mui/material/styles';
import logo from "@/logo.png";
import Image from 'next/image'

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const theme = useTheme();

  const links = [
    {
      id: 1,
      link: "home",
    },
    {
      id: 2,
      link: "about",
    },
    {
      id: 3,
      link: "portfolio",
    },
    {
      id: 4,
      link: "experience",
    },
    {
      id: 5,
      link: "contact",
    },
  ];

  return (
    <div style={{ backgroundColor: theme.palette.background.default }} className="flex justify-between items-center w-full h-20 px-4 fixed nav">
      <div className="pl-8">

        <Image
          src={logo}
          width={250}
          alt="Picture of the author"
        />

      </div>

      <ul className="hidden md:flex">
        {links.map(({ id, link }) => (
          <li key={id} style={{ color: theme.palette.text.primary }} className="px-4 cursor-pointer capitalize font-medium text-white hover:text-gray-300 transition duration-300">
            <Link href={`/${link}`}>{link}</Link>
          </li>
        ))}
      </ul>

      <div onClick={() => setNav(!nav)} className="cursor-pointer pr-4 z-10 text-gray-200 md:hidden">
        {/* Hamburger Icon */}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-white">
          {links.map(({ id, link }) => (
            <li key={id} className="px-4 cursor-pointer capitalize py-6 text-4xl">
              <Link onClick={() => setNav(!nav)} href={`/${link}`}>
                {link}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
