'use client';
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from '@mui/material/styles';
import logo from "@/logo.png";
import Image from 'next/image';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { animated, useSpring } from '@react-spring/web';

const Navbar = () => {
  const theme = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const toggleMobileMenu = () => {
    console.log("Toggling menu:", !mobileMenuOpen); // Debug: Check if this toggles
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const menuAnimation = useSpring({
    to: { 
      opacity: mobileMenuOpen ? 1 : 0, 
      transform: mobileMenuOpen ? `translateY(0)` : `translateY(-100vh)` // Use vh for full viewport height
    },
    from: { 
      opacity: 0, 
      transform: `translateY(-100vh)`,
    },
  });
  
  return (
    <div style={{ backgroundColor: theme.palette.background.default }} className="flex justify-between items-center h-20 px-4 fixed top-0 left-0 right-0">
      {/* Logo */}
      <div className="flex justify-center w-full md:w-auto">
        <Link href={`/`}>
          <Image priority src={logo} width={250} alt="Estate Market" loading='eager' rel="preload" fetchPriority='high' />
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex justify-center w-full">
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
            padding: '6px 30px',
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
            padding: '6px 30px',
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
      {/* Hamburger Menu */}
      <div className="md:hidden flex items-center">
        <Button onClick={toggleMobileMenu}>
          <MenuIcon />
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <animated.div style={menuAnimation} className="md:hidden translateY(-100%) absolute top-20 right-0 left-0 bg-white z-10 shadow-lg">
          <ul className="flex flex-col justify-center items-center py-4">
            {links.map(({ id, link }) => (
              <React.Fragment key={id}>
                <li className="px-4 cursor-pointer capitalize font-medium text-black hover:text-gray-300 transition duration-300 my-2">
                  <Link href={`/${link}`}>{link}</Link>
                </li>
                {id < links.length && <Divider />}
              </React.Fragment>
            ))}
          </ul>
        </animated.div>
      )}
    </div>
  );
};

export default Navbar;
