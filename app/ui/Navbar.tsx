'use client';
import Link from "next/link";
import React, { useState } from "react";
import { useTheme } from '@mui/material/styles';
import logo from "@/logo.png";
import Image from 'next/image';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

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
    <div style={{ backgroundColor: theme.palette.background.default, zIndex: 1000 }} className="flex justify-between items-center w-full h-20 px-4 fixed top-0 left-0 right-0">
      {/* Logo */}
      <div className="flex justify-center w-full md:w-auto">
        <Link href={`/`}>
          <Image  priority src={logo} width={250} alt="Estate Market" 
                    loading='eager'
                    rel="preload" 
                  fetchPriority='high'/>
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="hidden  	 md:flex justify-center w-full">
        {links.map(({ id, link }) => (
          <React.Fragment key={id}>
            <li className="px-4 cursor-pointer capitalize font-medium text-black hover:text-gray-300 transition duration-300">
              <Link href={`/${link}`}>{link}</Link>
            </li>
            {id < links.length && <Divider orientation="vertical" flexItem />}
          </React.Fragment>
        ))}
      </ul>

      {/* Login/Sign Up Buttons */}
      <div className="hidden md:flex justify-end items-center gap-2 mr-4" style={{ flex: 1 }}>
      <Button
    variant="contained"
    style={{
      flex: 1, // Allow the button to grow and fill the space
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      padding: '6px 20px',
      textTransform: 'none',
      letterSpacing: 'normal',
      fontWeight: 'bold',
      fontSize: '15px',
      borderRadius: '10px',
      boxShadow: 'none',
      whiteSpace: 'nowrap',
      transition: 'background-color 0.2s ease',
    }}
    sx={{
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    }}
  >
          Login
        </Button>

        <Button
    variant="contained"
    style={{
      flex: 1, // Similarly, allow this button to grow and fill the space
      backgroundColor: theme.palette.secondary.main,
      color: '#fff',
      padding: '6px 20px',
      textTransform: 'none',
      letterSpacing: 'normal',
      fontWeight: 'bold',
      fontSize: '15px',
      borderRadius: '10px',
      boxShadow: 'none',
      whiteSpace: 'nowrap',
      transition: 'background-color 0.2s ease',
    }}
    sx={{
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
      },
    }}
  >
          Sign Up
        </Button>
      </div>
      {/* Hamburger Menu - Visible on small screens */}
      <div className="md:hidden flex items-center">
        {/* Implement a toggle button for a dropdown or off-canvas menu */}
      </div>
    </div>
  );
};

export default Navbar;
