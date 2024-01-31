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
      <div className="flex justify-center w-full ">
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
      <div className="hidden md:flex justify-end items-center gap-2 mr-4">
        <Button
          variant="contained"
          style={{
            backgroundColor: theme.palette.primary.main,
            color: '#fff', // Text color
            padding: '8px 15px', // Keep the padding
            textTransform: 'none',
            letterSpacing: 'normal',
            fontWeight: 'bold',
            fontSize: '15px', // Keep the font size
            minWidth: '150px', // Increase the minWidth for a wider button
            borderRadius: '10px', // Reduced border radius
            boxShadow: 'none', // Remove box shadow
            whiteSpace: 'nowrap', // Prevent line break
            transition: 'background-color 0.2s ease', // Add hover transition
          }}
          // Hover style
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.primary.dark, // Change the background color on hover
            },
          }}
        >
          Login
        </Button>

        <Button
          variant="contained"
          style={{
            backgroundColor: theme.palette.secondary.main,
            color: '#fff', // Text color
            padding: '8px 15px', // Keep the padding
            textTransform: 'none',
            letterSpacing: 'normal',
            fontWeight: 'bold',
            fontSize: '15px', // Keep the font size
            minWidth: '150px', // Increase the minWidth for a wider button
            borderRadius: '10px', // Reduced border radius
            boxShadow: 'none', // Remove box shadow
            whiteSpace: 'nowrap', // Prevent line break
            transition: 'background-color 0.2s ease', // Add hover transition
          }}
          // Hover style
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark, // Change the background color on hover
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
